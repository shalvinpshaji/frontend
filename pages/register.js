import DatePicker from "@/components/DatePicker";
import Dropdown from "@/components/Dropdown";
import TimePicker from "@/components/TimePicker";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";

function Register() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [formState, setFormState] = useState({});

  const handleDrop = ([name, item]) => {
    console.log(name, item);
    setFormState({ ...formState, [name]: item });
  };

  const user = useUser();
  useEffect(() => {
    async function loadData() {
      if (user === null) {
        router.push("/", undefined, { shallow: true });
      }
      let peoples = await supabase
        .from("people")
        .select("id")
        .eq("user_id", user.id);
      if (peoples.error !== null) {
        return;
      }
      if (!peoples.data[0]["is_faculty"]) {
        router.push("/", undefined, { shallow: true });
        return;
      }

      console.log("people", peoples);
      let course_ids = await supabase
        .from("people_course")
        .select("course_id")
        .eq("people_id", peoples.data[0].id);
      console.log("Courses", course_ids);
    }
  });
  const onSubmit = () => {
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
    } else {
      console.log("Some data not present");
    }
  };
  return (
    <div className="shadow-md m-2">
      <h1>Schedule a Course</h1>
      <TimePicker saver={handleDrop} />
      <DatePicker saver={handleDrop} />
      <div className="flex">
        <div className="w-1/3"></div>
        <Dropdown
          def={"Select course to schedule"}
          saver={handleDrop}
          name={"course"}
        />
        <div className="w-4"></div>
        <Dropdown def={"Select room"} saver={handleDrop} name={"room"} />
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
  );
}

export default Register;
