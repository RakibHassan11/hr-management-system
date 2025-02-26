import { Layout } from '@/components/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ImportantLinks() {
  return (
    <Layout>
      <div className="p-6 bg-white text-[#1F2328] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Important Links</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#1F2328]">Description</TableHead>
                <TableHead className="text-[#1F2328]">URL</TableHead>
                <TableHead className="text-[#1F2328]">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-[#1F2328]">Medical Insurance Claim</TableCell>
                <TableCell>
                  <a href="https://gid.charteredlifebd.com/GID/" className="text-blue-600 hover:underline">
                    https://gid.charteredlifebd.com/GID/
                  </a>
                </TableCell>
                <TableCell className="text-green-600">✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-[#1F2328]">Medical Insurance Claim - Status Check</TableCell>
                <TableCell>
                  <a href="https://www.charteredlifebd.com/GID_PORTALS/ClaimStatus.aspx" className="text-blue-600 hover:underline">
                    https://www.charteredlifebd.com/GID_PORTALS/ClaimStatus.aspx
                  </a>
                </TableCell>
                <TableCell className="text-green-600">✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-[#1F2328]">OrangeToolz</TableCell>
                <TableCell>
                  <a href="https://orangetoolz.com/" className="text-blue-600 hover:underline">
                    https://orangetoolz.com/
                  </a>
                </TableCell>
                <TableCell className="text-green-600">✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-[#1F2328]">Aamra Networks Limited MRTG</TableCell>
                <TableCell>
                  <a href="http://csgraph.aamranetworks.com" className="text-blue-600 hover:underline">
                    http://csgraph.aamranetworks.com
                  </a>
                </TableCell>
                <TableCell className="text-green-600">✔</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}