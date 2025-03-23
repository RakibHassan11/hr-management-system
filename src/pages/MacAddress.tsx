import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MacAddress() {
  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">View/Edit Mac Address</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Official Laptop's Mac:
            </label>
            <Input
              type="text"
              className="w-full border border-gray-300"
              defaultValue="A0:51:0B:41:A6:31"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Personal Device's Mac:
            </label>
            <Input
              type="text"
              className="w-full border border-gray-300"
              defaultValue="48:01:C5:AA:10:A7"
              readOnly
            />
          </div>
          <Button>Update Record</Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <h2 className="text-lg font-semibold mb-4">
          Collection of MAC Address
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium">For Ubuntu/Linux:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Go to WiFi Settings</li>
              <li>Go to the settings of connected WiFi</li>
              <li>MAC Address will be listed in Hardware address</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium">For Windows:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>
                Click Start → Control Panel → Network and Internet → Network and
                Sharing Center
              </li>
              <li>
                Click the network you would like to view the MAC address for
              </li>
              <li>Click Details</li>
              <li>
                The MAC address is listed under the Physical Address heading
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
