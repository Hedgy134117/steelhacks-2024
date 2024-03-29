import json

import requests

BASE_QUERIES = "?institution=UPITT&x_acad_career=UGRD&"
BASE_LINK = "https://pitcsprd.csps.pitt.edu/psc/pitcsprd/EMPLOYEE/SA/s/WEBLIB_HCX_CM.H_COURSE_CATALOG.FieldFormula.IScript_"


# Gets all the courses but NOT their prereqs
def get_courses() -> dict:
    req = requests.get(BASE_LINK + "SubjectCourses" + BASE_QUERIES)
    # {
    # "courses": [
    #       {
    #           crse_id: ...,
    #           crse_offer_nbr: ...,
    #           effdt: ...,
    #           ...
    #       },
    #       ...
    #       ]
    # }
    return json.loads(req.content)["courses"]


# Gets a course's details, including its reqss
def get_course_details(course_id: int, effdt: str, crse_offer_nbr: int) -> dict:
    req = requests.get(
        BASE_LINK
        + "CatalogCourseDetails"
        + BASE_QUERIES
        + f"course_id={course_id}&effdt={effdt}&crse_offer_nbr={crse_offer_nbr}&use_catalog_print=Y"
    )
    # {
    # "course_details": {
    #       "course_title": ...,
    #       "offerings": [{"req_group": ..., ...}],
    #       ...
    # }
    return json.loads(req.content)["course_details"]
