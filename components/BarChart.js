import { Bar } from "react-chartjs-2";

export default function BarChart({ title, chartData, options }) {
  return (
    <div className="w-screen">
      <h2 className="text-center text-4xl py-6">{title}</h2>
      <div className="w-3/4 flex items-center justify-center">
        <Bar data={chartData} options={options}></Bar>
      </div>
    </div>
  );
}
