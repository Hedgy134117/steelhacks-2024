import json
from pprint import pprint

import api


class Course:
    def __init__(
        self,
        name: str,
    ):
        self.name


def main():
    CS_0441 = [105694, "2022-01-01", 3]
    pprint(api.get_course_details(*CS_0441))
    pprint(get_course_reqs(*CS_0441))
    pass


def get_course_reqs(course_id: int, effdt: str, crse_offer_nbr: int) -> dict:
    details = api.get_course_details(course_id, effdt, crse_offer_nbr)
    if "req_group" not in details["offerings"][0]:
        return None
    return details["offerings"][0]["req_group"]


if __name__ == "__main__":
    main()
