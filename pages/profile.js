import Loading from "@/components/Loading";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Profile() {
  const router = useRouter();

  const supabase = useSupabaseClient();

  const onSignOut = async () => {
    console.log("Signing out");
    console.log(user.id);
    await supabase.auth.signOut();

    router.push("/", undefined, { shallow: true });
  };
  const user = useUser();
  const [courses, setCourses] = useState();
  const [schedules, setSchedules] = useState();
  const [people, setPeople] = useState();
  const [room, setRoom] = useState();

  useEffect(() => {
    async function loadData() {
      console.log("User", user);
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
      let course_ids = await supabase
        .from("people_course")
        .select("course_id")
        .eq("people_id", peoples.data[0].id);
      course_ids = course_ids.data.map((element) => element.course_id);
      console.log(
        "Dater",
        moment().add(1, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss")
      );

      let schedules = await supabase
        .from("class_schedule")
        .select("*")
        .in("course", course_ids)
        .gt("datetime", moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"))
        .lt(
          "datetime",
          moment().add(1, "days").startOf("day").format("YYYY-MM-DD HH:mm:ss")
        )
        .order("datetime", { ascending: true });

      let rooms = await supabase.from("room").select("*");

      console.log("Course ids", course_ids);
      console.log(people);
      const { data } = await supabase
        .from("course")
        .select("*")
        .in("id", course_ids);
      console.log(schedules);
      setSchedules(schedules);
      setPeople(peoples.data);
      setCourses(data);
      setRoom(rooms);
    }
    loadData();
  }, [user]);

  if (user !== null) {
    return (
      <div className="py-2 flex space-x-80 w-screen left-2S">
        <div className="flex flex-col">
          <div>
            <div className="flex flex-row w-screen px-2">
              <h1 className=" text-4xl mb-16 grow">Profile Page</h1>
              {people && people[0].is_faculty && (
                <Link href={"/register"}>
                  <button className="bg-slate-700 p-3 text-slate-200 rounded-md hover:bg-slate-500 h-12 ">
                    Schedule class
                  </button>
                </Link>
              )}
              <Link href={"/dashboard"}>
                <button className="bg-slate-700 p-3 text-slate-200 rounded-md hover:bg-slate-500 h-12 mx-2">
                  Dashboard
                </button>
              </Link>
              <button
                className="bg-slate-700 p-3 text-slate-200 rounded-md hover:bg-slate-500 h-12 py-1"
                onClick={() => onSignOut()}
              >
                Signout
              </button>
            </div>
            <h2 className="text-3xl px-2">
              Welcome to NITC Atttendence Management System
            </h2>
            <h2 className="text-2xl px-2">
              Hello {user.user_metadata.full_name}, Profile Id:{" "}
              {people && people[0].id}
            </h2>
          </div>
          <div className="py-28 px-2">
            <h2 className="py-3 text-2xl text-slate-800">Registered Courses</h2>
            <div>
              {courses ? (
                <table className="divide-y min-w-full divide-gray-200 dark:divide-gray-700 text-center">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="border border-slate-600 text-white">
                        Course Code
                      </th>
                      <th className="border border-slate-600  text-white">
                        Course Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y  divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {courses.map((element) => {
                      return (
                        <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <td
                            className="py-4 px-6 border border-slate-600 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            key={element.id}
                          >
                            {element.id}
                          </td>
                          <td
                            className="py-4 px-6 border border-slate-600 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            key={element.name}
                          >
                            {element.name}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>Looks like you are not registered for any courses</p>
              )}
            </div>
          </div>
          {courses && (
            <div className="px-2">
              <h2 className="text-2xl text-slate-800 py-3">
                Classes scheduled for today
              </h2>
              {schedules.data.length != 0 ? (
                <table className="divide-y min-w-full divide-gray-200 dark:divide-gray-700 text-center">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="border border-slate-600 text-white">
                        Course Code
                      </th>
                      <th className="border border-slate-600  text-white">
                        Room
                      </th>
                      <th className="border border-slate-600  text-white">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y  divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {schedules.data.map((element) => {
                      const getRoom = (room_id) => {
                        console.log(room);
                        for (const r of room.data) {
                          if (r.id == room_id)
                            return `${r.building}, Room ${r.code}`;
                        }
                      };
                      const formatDate = (dateString) => {
                        const options = {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        };
                        return `${new Date(dateString).toLocaleTimeString(
                          "en-US"
                        )}, ${new Date(dateString).toLocaleDateString(
                          undefined,
                          options
                        )}`;
                      };
                      return (
                        <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <td
                            className="py-4 px-6 border border-slate-600 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            key={element.course}
                          >
                            {element.course}
                          </td>
                          <td
                            className="py-4 px-6 border border-slate-600 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            key={element.id}
                          >
                            {getRoom(element.room)}
                          </td>
                          <td
                            className="py-4 px-6 border border-slate-600 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            key={element.datetime}
                          >
                            {formatDate(element.datetime)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>Looks like you dont have any classes today, Enjoy!</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  return <Loading />;
}
// export const getServerSiderProps = async (ctx) => {
//   const re = {
//     redirect: {
//       destination: "/",
//       permanent: false,
//     },
//   };
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   console.log("Session: ", session);
//   if (!session) {
//     return re;
//   }
//   const user = session.user;
//   console.log(user.id);
//   const json = await supabase.from("people").select("*");
//   console.log("Deta", json);
//   console.log("hello");
//   return {
//     props: {
//       json,
//     },
//   };
// };
