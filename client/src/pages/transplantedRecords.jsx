import { format } from "date-fns"
import { useEffect, useState } from "react"
import { getAllTransplantedRecords, retrieveDataFromPinata } from "../main" 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { contractProvider } from "@/contract"
import { Button } from "@/components/ui/button"

export default function TransplantedRecordsTable() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [isDonor, setIsDonor] = useState(true)

  useEffect(() => {
    async function fetchRecords() {
      const data = await getAllTransplantedRecords() 
      setRecords(data)
      setLoading(false)
    }

    fetchRecords()
  }, [])
  const getDonorDetails= async (donorId,transplantedOrgan)=>{
    const donorCID=await contractProvider.getDonorCID(donorId);
    const donor=await retrieveDataFromPinata(donorCID);
    setIsDonor(true)
    setSelectedDetails({ id: donorId,transplantedOrgan:transplantedOrgan, ...donor })
    setOpenDialog(true)
  }
  const getRecipientDetails= async (recipientId,transplantedOrgan)=>{
    const recipientCID=await contractProvider.getRecipientCID(recipientId);
    const recipient=await retrieveDataFromPinata(recipientCID);
    setIsDonor(false)
    setSelectedDetails({ id: recipientId,transplantedOrgan:transplantedOrgan, ...recipient })
    setOpenDialog(true)
  }
  if (loading) return <p className="text-center mt-10 text-lg">Loading transplanted records...</p>

  if (records.length === 0)
    return <p className="text-center mt-10 text-lg text-muted-foreground">No transplanted records found.</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Transplanted Organ Records
        </h1>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Donor ID</TableHead>
                <TableHead>Recipient ID</TableHead>
                <TableHead>Organ</TableHead>
                <TableHead>Match Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.recordId}>
                  <TableCell>{record.recordId}</TableCell>
                  <TableCell>
                    {record.donorId}
                    <Button
                      variant="link"
                      className="ml-2 text-blue-600 hover:underline cursor-pointer"
                      onClick={() => getDonorDetails(record.donorId,record.organ)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                  <TableCell>
                    {record.recipientId}
                    <Button
                      variant="link"
                      className="ml-2 text-blue-600 hover:underline cursor-pointer"
                      onClick={() => getRecipientDetails(record.recipientId,record.organ)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                  <TableCell>{record.organ}</TableCell>
                  <TableCell>
                    {format(new Date(parseInt(record.matchDate) * 1000), "PPPpp")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize bg-green-300">
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isDonor ? "Donor Details" : "Recipient Details"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-left text-sm text-muted-foreground">
                {selectedDetails && (
                  <>
                    <p><strong>{isDonor?"Donor ID:":"Recipient ID:"}</strong> {selectedDetails.id}</p>
                    <p><strong>Name:</strong> {selectedDetails.name}</p>
                    <p><strong>Age:</strong> {selectedDetails.age}</p>
                    <p><strong>Blood Type:</strong> {selectedDetails.bloodType}</p>
                    <p><strong>Transplanted Organ:</strong> {selectedDetails.transplantedOrgan}</p>
                    {/* <p><strong>Contact Info:</strong> {selectedDetails.contactInfo}</p> */}
                    {isDonor?<p><strong>Status:</strong> {selectedDetails.status}</p>:<></>}
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button className="bg-black text-white hover:bg-black hover:text-white hover:outline hover:outline-2 hover:outline-white cursor-pointer">
              Close
            </Button>
          </AlertDialogCancel>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
