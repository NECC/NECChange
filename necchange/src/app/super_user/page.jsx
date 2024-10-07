import Link from "next/link";

export default function SuperUser() {
  const buttonStyles =
    "p-6 m-2 text-xl text-white border-0 border-white shadow-md rounded-md bg-sky-500 hover:bg-sky-600";

  return (
    <div className="flex justify-center h-screen bg-white text-black">
      <div className="grid grid-cols-3 m-auto">
        <Link className={buttonStyles} href="/super_user/users">
          Manage Users
        </Link>
        <Link className={buttonStyles} href="/">
          Manage Posts
        </Link>
        <Link className={buttonStyles} href="/super_user/trades">
          Manage Trades
        </Link>
        <Link
          className={buttonStyles + " col-span-3 text-center"}
          href="/super_user/dates"
        >
          Manage Dates
        </Link>
        <Link
          className={buttonStyles + " col-span-3 text-center"}
          href="/super_user/export_pdf"
        >
          Export UC Shifts
        </Link>
      </div>
    </div>
  );
}
