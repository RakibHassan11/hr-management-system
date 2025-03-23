import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

export default function ImportantLinks() {
  const links = [
    {
      description: "Medical Insurance Claim",
      url: "https://gid.charteredlifebd.com/GID/"
    },
    {
      description: "Medical Insurance Claim - Status Check",
      url: "https://www.charteredlifebd.com/GID_PORTALS/ClaimStatus.aspx"
    },
    {
      description: "OrangeToolz",
      url: "https://orangetoolz.com/"
    },
    {
      description: "Aamra Networks Limited MRTG",
      url: "http://csgraph.aamranetworks.com"
    }
  ]

  return (
    <div className="p-6 bg-white text-[#1F2328] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Important Links</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-[#1F2328]">Description</TableHead>
              <TableHead className="text-[#1F2328]">URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link, index) => (
              <TableRow key={index}>
                <TableCell className="text-[#1F2328]">
                  {link.description}
                </TableCell>
                <TableCell>
                  <a href={link.url} className="text-blue-600 hover:underline">
                    {link.url}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
