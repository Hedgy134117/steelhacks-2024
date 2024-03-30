import json
import re
from pprint import pprint

import api
import regex


def main():
    CS_0441 = [105694, "2022-01-01", 3]
    CS_1501 = [105761, "2024-01-01", 1]
    CS_1550 = [105774, "2019-06-01", 1]
    # pprint(api.get_course_details(*CS_0441))
    # print(get_course_reqs(*CS_1550))
    bigimportantdata = {}

    for course in api.get_courses():
        try:
            reqs = get_course_reqs(
                course["crse_id"], course["effdt"], course["crse_offer_nbr"]
            )
            if "CS " + course["catalog_nbr"] in bigimportantdata:
                pass
            else:
                bigimportantdata["CS " + course["catalog_nbr"]] = str(reqs[0])
        except IndexError:
            # TODO: 13 / 113 courses are erroring
            print(f"{course['descr']}: ERROR")
            bigimportantdata["CS " + course["catalog_nbr"]] = "MISSING"

    with open("bigimportantdata.json", "w") as f:
        json.dump(bigimportantdata, f)


def get_course_reqs(course_id: int, effdt: str, crse_offer_nbr: int) -> dict:
    details = api.get_course_details(course_id, effdt, crse_offer_nbr)
    if "req_group" not in details["offerings"][0]:
        return None
    return parse_reqs(details["offerings"][0]["req_group"])


def sanitize_reqs(reqs: str) -> str:
    # there's probably a better way to do this
    reqs = reqs.replace(" or Math Placement Score (46 or greater)", "")
    reqs = reqs.replace(" or any MATH greater than or equal to MATH 0031", "")
    reqs = reqs.replace(" and COE Major", "")
    # replace with r" ?\(min .*\)" with case insensitive flag
    reqs = reqs.replace(" (Min Grade 'C')", "")
    reqs = reqs.replace(" (Min Grade 'C' or Transfer)", "")
    reqs = reqs.replace(" (MIN GRADE 'C' or Transfer)", "")
    reqs = reqs.replace(" (MIN GRADE 'C' OR TRANSFER)", "")
    reqs = reqs.replace("(Min Grade 'C' or Transfer for All Listed Courses)", "")
    reqs = reqs.replace(" (MIN GRADE 'C' or Transfer For All Listed Coures)", "")

    reqs = reqs.replace(" with a minimum grade of C or TRANSFER", "")
    reqs = reqs.replace(", MIN GPA: 3.25", "")
    reqs = reqs.replace("CS (", "(")
    reqs = reqs.replace("CS or COE", "CS/COE")
    print("\t" + reqs)
    return reqs


def parse_reqs(reqs: str) -> list:
    reqs = sanitize_reqs(reqs)
    preqsAndCreqs = reqs.split("; ")

    # there's a few that don't have a space after the ;
    if ";" in reqs:
        preqsAndCreqs = reqs.split(";")
    preqs = preqsAndCreqs[0].split("PREQ: ")

    # only parse preqs if they exist
    if len(preqs) > 1:
        preqs = parse_req_str(preqs[1])
    else:
        preqs = None

    # only parse creqs if they exist
    if len(preqsAndCreqs) > 1 and "CREQ" in preqsAndCreqs[1]:
        creqs = preqsAndCreqs[1].split("CREQ: ")
        creqs = parse_req_str(creqs[1])
    else:
        creqs = None

    return (preqs, creqs)


# best not to think about the run time of this function
def parse_req_str(reqs: str) -> list:
    # (CS 0441 or CS 0406) and ((CS 0445 or CS 0455 or COE 0445) or (CS 0245 and CS 0207))
    # (["CS 0441", "CS 0406"], [["CS 0445", "CS 0455", "COE 0445"], ("CS 0245", "CS 0207")])
    # or: classes within a list
    # and: classes within a tuple

    # ( ) -> [ ]
    # [CS 0441 or CS 0406] and [[CS 0445 or CS 0455 or COE 0445] or [CS 0245 and CS 0207]]
    reqs = reqs.replace("(", "[").replace(")", "]")
    print(f"\t {reqs}")

    # " or " -> ", "
    # [CS 0441, CS 0406] and [[CS 0445, CS 0455, COE 0445], [CS 0245 and CS 0207]]
    reqs = reqs.replace(" or ", ", ")
    if "\xa0" in reqs:
        reqs = reqs.replace("\xa0", " ").replace(" or ", ", ")
    print(f"\t {reqs}")

    # Outer Level " and " -> ", " and surround with ( )
    # ([CS 0441, CS 0406], [[CS 0445, CS 0455, COE 0445], [CS 0245 and CS 0207]])
    level = 0
    for i in range(len(reqs)):
        if reqs[i] == "[":
            level += 1
        elif reqs[i] == "]":
            level -= 1

        if i + 3 < len(reqs) and reqs[i : i + 3] == "and" and level == 0:
            # " and " -> ", "
            reqs = f"{reqs[:i - 1]},  {reqs[i + 4:]}"
            # surround with ( )
            if "(" not in reqs:
                reqs = f"({reqs})"
    print(f"\t {reqs}")

    # Inner Level " and " -> ", " and replace [ ] with ( )
    # ([CS 0441, CS 0406], [[CS 0445, CS 0455, COE 0445], (CS 0245 , CS 0207)])
    level = 0
    for i in range(len(reqs)):
        if reqs[i] == "[":
            level += 1
        elif reqs[i] == "]":
            level -= 1

        if reqs[i] == "a" and level != 0:
            # " and " -> ", "
            reqs = f"{reqs[:i - 1]},    {reqs[i + 4:]}"
            # Replace [ with (
            wait = False
            for j in range(i, -1, -1):
                if reqs[j] == "[":
                    if wait:  # skip nested nested []/()
                        wait = False
                        continue
                    reqs = f"{reqs[:j]}({reqs[j+1:]}"
                    break
                elif reqs[j] == "]":
                    wait = True
            # Replace ] with )
            wait = False
            for j in range(i, len(reqs)):
                if reqs[j] == "]":
                    if wait:  # skip nested nested []/()
                        wait = False
                        continue
                    reqs = f"{reqs[:j]}){reqs[j+1:]}"
                    break
                elif reqs[j] == "[":
                    wait = True
    print(f"\t {reqs}")

    # 'abc' -> '"abc"'
    reqs = re.sub(r"([A-Za-z/]+ \d+)", r'"\1"', reqs)
    print(f"\t {reqs}")

    # '123' -> '"123"' (pitt's fault for not clearly defining their reqs)
    reqs = regex.sub(r'(?<=^([^"]|"[^"]*")*)(\d+)', r'"\2"', reqs)
    print(f"\t {reqs}")

    if not ("(" in reqs or "[" in reqs):
        return eval(f"[{reqs}]")

    return eval(reqs)


if __name__ == "__main__":
    main()
