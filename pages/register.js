import DatePicker from "@/components/DatePicker";
import Dropdown from "@/components/Dropdown";
import TimePicker from "@/components/TimePicker";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import FailureAlert from "@/components/FailureAlert";
import Loading from "@/components/Loading";
import moment from "moment";

function Register() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [formState, setFormState] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [courses, setCourses] = useState();
  const [rooms, setRoooms] = useState();
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [peopleid, setPeopleid] = useState();

  const handleDrop = ([name, item]) => {
    console.log(name, item);
    setFormState({ ...formState, [name]: item });
  };

  const user = useUser();
  useEffect(() => {
    async function loadData() {
      console.log("User in Register component****", user);
      if (user === null) {
        router.push("/", undefined, { shallow: true });
        return;
      }
      let peoples = await supabase
        .from("people")
        .select("*")
        .eq("user_id", user.id);
      if (peoples.error !== null) {
        return;
      }
      console.log("people", peoples);
      if (!peoples.data[0]["is_faculty"]) {
        console.log("Not Faculty pushing to root");
        console.log("people", peoples);
        console.log("Faculty Status", peoples.data[0]["is_faculty"]);
        router.push("/", undefined, { shallow: true });
        return;
      }

      let course_ids = await supabase
        .from("people_course")
        .select("course_id")
        .eq("people_id", peoples.data[0].id);
      course_ids = course_ids.data.map((value, index) => {
        return { id: index, label: value["course_id"] };
      });
      let rooms = await supabase.from("room").select("*");
      rooms = rooms.data.map((r) => {
        return { id: r.id, label: `${r.building}, Room ${r.code}` };
      });
      setRoooms(rooms);
      console.log("Courses", course_ids);
      setCourses(course_ids);
      setPeopleid(peoples.data[0].id);
    }
    loadData();
  }, [user]);
  const commitSubmit = () => {
    return;
  };
  const onSubmit = async () => {
    setShowAlert(true);
    if (
      formState["date"] &&
      formState["hour"] &&
      formState["minute"] &&
      formState["room"] &&
      formState["course"] &&
      formState["hour"] !== "" &&
      formState["minute"] !== ""
    ) {
      console.log("All Data Present");
      let datetime = moment(formState["date"]);
      datetime.add(formState["hour"], "hours");
      datetime.add(formState["minute"], "minutes");
      console.log(datetime.toString());
      let endTime = moment(datetime);
      let schedules = await supabase
        .from("class_schedule")
        .select("*")
        .gt("datetime", datetime.format("YYYY-MM-DD HH:mm:ss"))
        .lt("datetime", endTime.add(1, "hours").format("YYYY-MM-DD HH:mm:ss"));
      let schedules_e = await supabase
        .from("class_schedule")
        .select("*")
        .gt("end_datetime", datetime.format("YYYY-MM-DD HH:mm:ss"))
        .lt(
          "end_datetime",
          datetime.add(1, "hours").format("YYYY-MM-DD HH:mm:ss")
        );
      if (schedules.data.length != 0 || schedules_e.data.length != 0) {
        setMessage("Room occupied at this time");
        setAlertType("failure");
      } else {
        console.log("Trying to insert into table");
        let s_datetime = moment(formState["date"]);
        s_datetime.add(formState["hour"], "hours");
        s_datetime.add(formState["minute"], "minutes");
        let c = await supabase.from("class_schedule").insert({
          datetime: s_datetime.format("YYYY-MM-DD HH:mm:ss"),
          course: formState["course"]["label"],
          room: formState["room"]["id"],
          created_by: peopleid,
          end_datetime: s_datetime
            .add(1, "hours")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
        console.log("Insert Status", c);
        if (c.error === null) {
          setMessage("Schedule created successfully, redirecting...");
          setAlertType("success");
          setTimeout(() => {
            router.push("/", undefined, { shallow: true });
          }, 3000);

          return;
        } else {
          setMessage("Could not create schedule");
          setAlertType("failure");
        }
      }
    } else {
      setMessage("One or more fields are empty");
      setAlertType("failure");
      console.log("Some data not present");
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  return (
    <div>
      {courses && rooms ? (
        <div className="shadow-md m-2">
          <h1 className="text-4xl mb-16 grow">Schedule a Course</h1>
          {showAlert && <FailureAlert message={message} type={alertType} />}
          <TimePicker saver={handleDrop} />
          <DatePicker saver={handleDrop} />
          <div className="flex">
            <div className="w-1/3"></div>
            <Dropdown
              def={"Select course to schedule"}
              saver={handleDrop}
              name={"course"}
              items={courses}
            />
            <div className="w-4"></div>
            <Dropdown
              def={"Select room"}
              saver={handleDrop}
              name={"room"}
              items={rooms}
            />
            <div className="w-1/3"></div>
          </div>
          <button
            className="bg-slate-700 px-5 py-3  text-slate-200 rounded-md hover:bg-slate-500 mx-2 mb-8 mt-10 ml-5"
            onClick={() => {
              console.log(formState);
              onSubmit();
            }}
          >
            Schedule
          </button>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Register;
