import { useEffect, useState } from "react"
import { getAllMatchedRecords, transplant } from "../main"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function MatchedRecordsTable() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [transplantingId, setTransplantingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchRecords() {
      const data = await getAllMatchedRecords()
      setRecords(data)
      setLoading(false)
    }

    fetchRecords()
  }, [transplantingId])

  const handleTransplant = async (record) => {
    setTransplantingId(record.recordId)
    const toastId = toast.loading('Transplanting...', {
      position: 'bottom-right',
      style: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: '16px',
        borderRadius: '8px',
        padding: '12px 24px',
      },
    });
    try {
      await transplant(record)
      // navigate('/getTransplantedRecords')
      toast.success(`Transplanted ${record.organ}`, { id: toastId });
    } catch (error) {
      console.error("Error during transplant operation:", error)
      toast.error("Transplant failed", { id: toastId });
    } finally {
      setTransplantingId(null)
    }
  }

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading matched records...</p>

  if (records.length === 0)
    return <p className="text-center mt-10 text-lg text-muted-foreground">No matched records found.</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Matched Organ Records
        </h1>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match ID</TableHead>
                <TableHead>Donor ID</TableHead>
                <TableHead>Recipient ID</TableHead>
                <TableHead>Organ</TableHead>
                <TableHead>Match Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.recordId}>
                  <TableCell>{record.recordId}</TableCell>
                  <TableCell>{record.donorId}</TableCell>
                  <TableCell>{record.recipientId}</TableCell>
                  <TableCell>{record.organ}</TableCell>
                  <TableCell>
                    {format(new Date(parseInt(record.matchDate) * 1000), "PPPpp")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50 cursor-pointer"
                      disabled={record.status !== "matched" || transplantingId !== null}
                      onClick={() => handleTransplant(record)}
                    >
                      {transplantingId === record.recordId ? "Updating..." : "Transplant"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
