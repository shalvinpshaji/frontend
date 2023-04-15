import Head from "next/head";
import Link from "next/link";

export default function Header() {
  return (
    <div>
      <Head>
        <meta name="description" content="Attendence Management | NITC" />
        <title>Attendence Manager | NITC</title>
      </Head>
      <div className="flex h-20 w-screen bg-slate-700 text-slate-200 border-l-emerald-500 items-center">
        <Link href={"/"}>
          <div className="text-3xl px-3">Attendence Manager NITC</div>
        </Link>
      </div>
    </div>
  );
}
