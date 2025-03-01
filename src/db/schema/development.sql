WITH days(day) AS (
  VALUES ( 'Monday' ), ( 'Tuesday' ), ( 'Wednesday' ), ( 'Thursday' ), ( 'Friday' )
)
INSERT INTO days (name)
SELECT day FROM days;

WITH times(time) AS (
	VALUES ('12pm'), ('1pm'), ('2pm'), ('3pm'), ('4pm')
)
INSERT INTO appointments (time, day_id)
SELECT time, id as day_id FROM days, times ORDER BY day_id, time;

INSERT INTO interviewers (name, avatar)
VALUES
  ('Sylvia Palmer', 'images/sylvia_palmer.png'),
  ('Tori Malcolm', 'images/tori_malcolm.png'),
  ('Mildred Nazir', 'images/mildred_nazir.png'),
  ('Cohana Roy', 'images/cohana_roy.jpg'),
  ('Sven Jones', 'images/sven_jones.jpg'),
  ('Susan Reynolds', 'images/susan_reynolds.jpg'),
  ('Alec Quon', 'images/alec_quon.jpg'),
  ('Viktor Jain', 'images/viktor_jain.jpg'),
  ('Lindsay Chu', 'images/lindsay_chu.jpg'),
  ('Samantha Stanic', 'images/samantha_stanic.jpg');

INSERT INTO available_interviewers (day_id, interviewer_id)
SELECT 1 as day_id, interviewers.interviewer_id FROM ( SELECT id AS interviewer_id FROM interviewers ORDER BY RANDOM() LIMIT 5 ) interviewers;

INSERT INTO available_interviewers (day_id, interviewer_id)
SELECT 2 as day_id, interviewers.interviewer_id FROM ( SELECT id AS interviewer_id FROM interviewers ORDER BY RANDOM() LIMIT 5 ) interviewers;

INSERT INTO available_interviewers (day_id, interviewer_id)
SELECT 3 as day_id, interviewers.interviewer_id FROM ( SELECT id AS interviewer_id FROM interviewers ORDER BY RANDOM() LIMIT 5 ) interviewers;

INSERT INTO available_interviewers (day_id, interviewer_id)
SELECT 4 as day_id, interviewers.interviewer_id FROM ( SELECT id AS interviewer_id FROM interviewers ORDER BY RANDOM() LIMIT 5 ) interviewers;

INSERT INTO available_interviewers (day_id, interviewer_id)
SELECT 5 as day_id, interviewers.interviewer_id FROM ( SELECT id AS interviewer_id FROM interviewers ORDER BY RANDOM() LIMIT 5 ) interviewers;

WITH
appointments AS (
  SELECT id as appointment_id, day_id FROM appointments ORDER BY RANDOM() LIMIT 10
),
students(name) AS(
  VALUES
    ('Liam Martinez'),
    ('Richard Wong'),
    ('Lydia Miller-Jones'),
    ('Archie Cohen'),
    ('Chad Takahashi'),
    ('Leopold Silvers'),
    ('Maria Boucher'),
    ('Jamal Jordan'),
    ('Michael Chan-Montoya'),
    ('Yuko Smith')
)
INSERT INTO interviews (student, appointment_id, interviewer_id)
SELECT
  DISTINCT ON 
  (s.name) name,
  a.appointment_id AS appointment_id,
  available_interviewers.interviewer_id AS interviewer_id
FROM (
  SELECT
    *, row_number() OVER(ORDER BY appointment_id) AS rnum
  FROM appointments
) AS a
JOIN (
  SELECT
    *, row_number() OVER(ORDER BY name) AS rnum
  FROM students
) AS s
ON a.rnum = s.rnum
JOIN available_interviewers
ON a.day_id = available_interviewers.day_id;
