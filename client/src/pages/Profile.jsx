import { useSelector } from "react-redux";

export default function Profile() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Profile</h1>
      <pre className="bg-gray-100 p-4 mt-4 rounded">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
