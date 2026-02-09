import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEmployeeProfile } from "@/features/employee/hooks/useEmployeeProfile";
import toast from "react-hot-toast";

export default function MacAddress() {
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useEmployeeProfile(user?.id || null);

  const officialMacRef = useRef<HTMLInputElement>(null);
  const personalMacRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      if (officialMacRef.current) officialMacRef.current.value = profile.official_mac || "";
      if (personalMacRef.current) personalMacRef.current.value = profile.personal_mac || "";
    }
  }, [profile]);

  const handleUpdate = async () => {
    if (!profile) return;

    const officialMac = officialMacRef.current?.value || "";
    const personalMac = personalMacRef.current?.value || "";

    const success = await updateProfile({
      ...profile,
      official_mac: officialMac,
      personal_mac: personalMac
    });

    // Toast handling is done inside updateProfile hook
  };

  if (!user) {
    return <div className="p-6 text-center">Please log in to view this page.</div>;
  }

  if (profileLoading && !profile) {
    return <div className="p-6 text-center">Loading...</div>;
  }

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
              placeholder="e.g. A0:51:0B:41:A6:31"
              ref={officialMacRef}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Personal Device's Mac:
            </label>
            <Input
              type="text"
              className="w-full border border-gray-300"
              placeholder="e.g. 48:01:C5:AA:10:A7"
              ref={personalMacRef}
            />
          </div>
          <Button onClick={handleUpdate} disabled={profileLoading}>
            {profileLoading ? 'Updating...' : 'Update Record'}
          </Button>
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
