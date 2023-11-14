# External_id calculation

If `external_id` exist it should be used (regardless of name/surname/phone). If `external_id` doesn't exist, calculate it from name/surname/phone

* only name/surname/phone: `name-only/schedule_a_b_007.json`
* name/surname/phone and external_id: `name-plus-external_id/schedule_a_b_007_9e172829a4704907018fecb0f2cf5df101695665dda67185c4b4236fbe68a052.json`
* only external_id: `external_id-only/schedule_9e172829a4704907018fecb0f2cf5df101695665dda67185c4b4236fbe68a052.json`

uses:
* `python scripts/upload-schedule.py --server=dev test_external_id/name-only/ test_external_id/name-only/`
  * check if 9e172829a4704907018fecb0f2cf5df101695665dda67185c4b4236fbe68a052 user created
  * delete above user
* `python scripts/upload-schedule.py --server=dev test_external_id/name-plus-external_id/ test_external_id/name-plus-external_id/`
  * check if 9e172829a4704907018fecb0f2cf5df101695665dda67185c4b4236fbe68a052 user created
  * delete above user
* `python scripts/upload-schedule.py --server=dev test_external_id/external_id-only/ test_external_id/external_id-only/`
  * check if 9e172829a4704907018fecb0f2cf5df101695665dda67185c4b4236fbe68a052 user created
  * delete above user
