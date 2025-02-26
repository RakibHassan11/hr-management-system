import { Layout } from '@/components/Layout';
import ima from '../lovable-uploads/pet.jpg';

export default function Home() {
  return (
    <Layout>
      <div className="animate-fadeIn p-6 flex flex-col gap-6">
        <div className="flex gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328] flex-1">
            <div className="flex items-center gap-6 mb-6">
              <img
                src={ima}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-orange-500"
              />
              <div>
                <h1 className="text-2xl font-semibold">Rakibul Hassan Rakib</h1>
                <p className="text-lg text-gray-700">Jr. Software Engineer</p>
                <p className="text-gray-600">Software Development</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328] flex-1">
            <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border border-gray-300">Leave Type</th>
                  <th className="py-2 px-4 border border-gray-300">Current</th>
                  <th className="py-2 px-4 border border-gray-300">Beginning of Year/Joining</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Annual', current: '0.00', joining: '0.00' },
                  { type: 'Sick', current: '0.00', joining: '0.00' },
                  { type: 'Emergency', current: '0.00', joining: '0.00' },
                ].map((leave) => (
                  <tr key={leave.type} className="text-center">
                    <td className="py-2 px-4 border border-gray-300">{leave.type}</td>
                    <td className="py-2 px-4 border border-gray-300">{leave.current}</td>
                    <td className="py-2 px-4 border border-gray-300">{leave.joining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-[#1F2328]">
          <h2 className="text-xl font-semibold mb-4">Attendances</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border border-gray-300"></th>
                {["Tue 18", "Wed 19", "Thu 20", "Fri 21", "Sat 22", "Sun 23", "Mon 24", "Tue 25"].map((day) => (
                  <th key={day} className="py-2 px-4 border border-gray-300">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="py-2 px-4 font-medium border border-gray-300">In:</td>
                <td className="py-2 px-4 border border-gray-300">09:29</td>
                <td className="py-2 px-4 border border-gray-300">09:44</td>
                <td className="py-2 px-4 border border-gray-300">09:41</td>
                <td className="py-2 px-4 border border-gray-300">-</td>
                <td className="py-2 px-4 border border-gray-300">-</td>
                <td className="py-2 px-4 border border-gray-300">09:35</td>
                <td className="py-2 px-4 border border-gray-300">09:44</td>
                <td className="py-2 px-4 text-green-500 border border-gray-300">09:46</td>
              </tr>
              <tr className="text-center">
                <td className="py-2 px-4 font-medium border border-gray-300">Out:</td>
                <td className="py-2 px-4 border border-gray-300">19:27</td>
                <td className="py-2 px-4 border border-gray-300">19:30</td>
                <td className="py-2 px-4 border border-gray-300">17:59</td>
                <td className="py-2 px-4 border border-gray-300">-</td>
                <td className="py-2 px-4 border border-gray-300">-</td>
                <td className="py-2 px-4 border border-gray-300">19:24</td>
                <td className="py-2 px-4 border border-gray-300">19:52</td>
                <td className="py-2 px-4 text-green-500 border border-gray-300">13:53</td>
              </tr>
              <tr className="text-center">
                <td className="py-2 px-4 font-medium border border-gray-300">Duration:</td>
                <td className="py-2 px-4 border border-gray-300">09:58</td>
                <td className="py-2 px-4 border border-gray-300">09:45</td>
                <td className="py-2 px-4 border border-gray-300">08:18</td>
                <td className="py-2 px-4 border border-gray-300">-</td>
                <td className="py-2 px-4 border border-gray-300">-</td>
                <td className="py-2 px-4 border border-gray-300">09:48</td>
                <td className="py-2 px-4 border border-gray-300">10:08</td>
                <td className="py-2 px-4 text-green-500 border border-gray-300">04:06</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}