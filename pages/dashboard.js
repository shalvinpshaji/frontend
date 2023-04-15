import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BarChart from "@/components/BarChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import Loading from "@/components/Loading";

Chart.register(CategoryScale);

export default function DashBoard() {
  const router = useRouter();

  const supabase = useSupabaseClient();
  const user = useUser();
  const [options, setOptions] = useState();
  const [totals, setTotals] = useState();
  useEffect(() => {
    async function loadData() {
      if (user === null) {
        return;
      }
      let peoples = await supabase
        .from("people")
        .select("id")
        .eq("user_id", user.id);
      if (peoples.error !== null) {
        return;
      }
      let course_ids = await supabase
        .from("people_course")
        .select("course_id")
        .eq("people_id", peoples.data[0].id);
      let course_names = course_ids.data.map((element) => element.name);
      console.log("Course Names", course_names);
      course_ids = course_ids.data.map((element) => element.course_id);
      let schedules = await supabase.from("class_schedule").select("*");
      let attendance = await supabase
        .from("attendance")
        .select("*")
        .eq("person", peoples.data[0].id);
      console.log("Schedules ");
      console.log(schedules);
      console.log("Attendance");
      console.log(attendance);
      let attended_schedules = [];
      for (let a of attendance.data) {
        attended_schedules.push(a.schedule_id);
      }
      let totals = {};
      for (var c_tid of course_ids) {
        totals[c_tid] = {
          name: "",
          total_count: 0,
          attended_count: 0,
          percentage: 0,
        };
      }
      const in_schedules = schedules.data.filter((t) =>
        course_ids.includes(t.course)
      );
      for (var [i, c_tid] of course_ids.entries()) {
        var t = in_schedules.filter((t) => t.course == c_tid);
        totals[c_tid]["total_count"] = t.length;
        var k = attended_schedules.filter((i) =>
          t.map((t) => t.id).includes(i)
        );
        totals[c_tid]["attended_count"] = k.length;
        totals[c_tid]["name"] = course_names[i];
        if (totals[c_tid]["total_count"] !== 0) {
          totals[c_tid]["percentage"] =
            (totals[c_tid]["attended_count"] * 100) /
            totals[c_tid]["total_count"];
          totals[c_tid]["percentage"] = Math.round(totals[c_tid]["percentage"]);
        }
      }
      console.log("Totals");
      console.log(totals);
      console.log(
        "Data",
        Object.entries(totals).map((k, v) => k)
      );
      const options = {
        labels: course_ids,
        // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
        datasets: [
          {
            label: "Attendance Percentage",
            data: Object.entries(totals).map(([k, v]) => v["percentage"]),
            // you can set indiviual colors for each bar
            backgroundColor: [
              //   "rgba(75,192,192,1)",
              "&quot;#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 2,
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  max: 500,
                },
              },
            },
          },
        ],
      };
      setOptions(options);
      setTotals(totals);
      console.log("Attended schedules");
      console.log(attended_schedules);
    }
    loadData();
  }, [user]);
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };
  return (
    <div>
      <div className="w-3/4 p-8">
        {options ? (
          <BarChart
            chartData={options}
            title={"Attendance Percentage"}
            options={chartOptions}
          />
        ) : (
          <Loading />
        )}
      </div>
      {totals && (
        <table className="divide-y min-w-full divide-gray-200 dark:divide-gray-700 text-center p-6">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="border border-slate-600 text-white">
                Course Code
              </th>
              <th className="border border-slate-600  text-white">
                Total Attended
              </th>
              <th className="border border-slate-600  text-white">
                Total Classes Scheduled
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y  divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {Object.entries(totals).map(([k, v]) => {
              return (
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td
                    className="py-4 px-6 border border-slate-600 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    key={k}
                  >
                    {k}
                  </td>

                  <td
                    className="py-4 px-6 border border-slate-600 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    key={v["name"]}
                  >
                    {v["attended_count"]}
                  </td>
                  <td
                    className="py-4 px-6 border border-slate-600 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    key={v["name"]}
                  >
                    {v["total_count"]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
