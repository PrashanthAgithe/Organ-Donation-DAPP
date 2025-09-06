import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  getAlldonorIDs,
  getAllrecipientIDs,
  retrieveDataFromPinata,
  getCityName,
  transplant
} from "@/main"
import { contractProvider, isAuthorized } from "@/contract"

export default function FindDonors() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [recipientId, setRecipientId] = useState("")
  const [organFilter, setOrganFilter] = useState("")
  const [bloodTypeFilter, setBloodTypeFilter] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [canTransplant, setCanTransplant] = useState(false)

  // Fetch location once when component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        () => {
          setUserLocation(null) // fallback if denied or error
        }
      )
    } else {
      setUserLocation(null)
    }
  }, [])

  function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371 // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return parseFloat(distance.toFixed(2)) // number with 2 decimals
  }

  // Whenever recipientId changes → check auth + fetch recipient info
  useEffect(() => {
    async function checkRecipient() {
      const recipientIds=await getAllrecipientIDs();
    //   console.log(recipientIds)
      if (recipientIds.find(id => id === recipientId) === undefined) {
        setCanTransplant(false)
        return
      }

      try {
        const recipientCID = await contractProvider.getRecipientCID(recipientId)
        const recipient = await retrieveDataFromPinata(recipientCID)

        // Prefill filters from recipient data
        if (recipient.requiredOrgan) {
          setOrganFilter(recipient.requiredOrgan)
        }
        if (recipient.bloodType) {
          setBloodTypeFilter(recipient.bloodType)
        }
        if (isAuthorized) {
          setCanTransplant(true)
        } else {
          setCanTransplant(false)
        }
      } catch (err) {
        console.error("Error fetching recipient:", err)
        toast.error("Invalid Recipient ID")
        setCanTransplant(false)
      }
    }

    checkRecipient()
  }, [recipientId])

  useEffect(() => {
    async function fetchDonors() {
      const toastId = toast.loading("Loading donors...", {
        position: "bottom-right",
        style: {
          backgroundColor: "white",
          color: "black",
          fontSize: "16px",
          borderRadius: "8px",
          padding: "12px 24px",
        },
      })

      try {
        const donorIds = await getAlldonorIDs()
        const donorList = []

        for (const donorId of donorIds) {
          try {
            const donorCID = await contractProvider.getDonorCID(donorId)
            const donor = await retrieveDataFromPinata(donorCID)

            if (donor.status === "available") {
              // calculate distance if userLocation + donor.location exist
              if (userLocation && donor.location) {
                donor.city = await getCityName(
                  donor.location.lat,
                  donor.location.lng
                )
                donor.distance = getDistance(
                  userLocation.lat,
                  userLocation.lng,
                  donor.location.lat,
                  donor.location.lng
                )
              } else {
                donor.distance = null
              }
            //   console.log("Donor:", donor)
              donor.city = donor.city || "Unknown"
              donorList.push(donor)
            }
          } catch (err) {
            console.error(`Error fetching donor ${donorId}:`, err)
          }
        }

        // sort donors by distance (null values go last)
        donorList.sort((a, b) => {
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        })

        setDonors(donorList)
      } catch (err) {
        console.error("Error fetching donor IDs:", err)
        toast.error("Failed to load donors")
      } finally {
        toast.dismiss(toastId)
        setLoading(false)
      }
    }
    fetchDonors()
  }, [userLocation])

  const handleTransplant = async (donor) => {
    const record = {
        donorId: donor.donorId,
        recipientId: recipientId,
        organ: organFilter
    };

    // Disable the transplant button while processing
    setCanTransplant(false);

    // Show loading toast
    const toastId = toast.loading("Transplanting...", {
        position: "bottom-right",
        style: {
        backgroundColor: "white",
        color: "black",
        fontSize: "16px",
        borderRadius: "8px",
        padding: "12px 24px",
        },
    });

    try {
        // Attempt the transplant
        await transplant(record);

        // On success, show success toast
        toast.dismiss(toastId);
        toast.success("Transplant successful!", {
        position: "bottom-right",
        style: {
            backgroundColor: "green",
            color: "white",
            fontSize: "16px",
            borderRadius: "8px",
            padding: "12px 24px",
        },
        });
    } catch (err) {
        // On failure, show error toast
        toast.dismiss(toastId);
        toast.error("Transplant failed: " + (err.message || err), {
        position: "bottom-right",
        style: {
            backgroundColor: "red",
            color: "white",
            fontSize: "16px",
            borderRadius: "8px",
            padding: "12px 24px",
        },
        });

        console.error("Transplant error:", err);
    } finally {
        // Re-enable the button if needed
        setRecipientId("");
    }
    };


  // Apply filters
  const filteredDonors = donors.filter((d) => {
    return (
        (!organFilter || d.organsAvailable.includes(organFilter)) &&
        (!bloodTypeFilter || d.bloodType === bloodTypeFilter)
    )
  })


  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading donors...</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Find Donors
        </h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Recipient ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            className="border px-3 py-2 rounded w-1/3"
          />
          or Filters
          <select
            value={organFilter}
            onChange={(e) => setOrganFilter(e.target.value)}
            className={`border px-3 py-2 rounded ${
                recipientId ? "bg-gray-200 text-gray-700 cursor-not-allowed" : ""
            }`}
            disabled={recipientId !== ""}
            >
            <option value="">Filter by Organ</option>
            <option value="Heart">Heart</option>
            <option value="Liver">Liver</option>
            <option value="Kidney">Kidney</option>
            <option value="Lungs">Lungs</option>
            <option value="Pancreas">Pancreas</option>
            <option value="Intestines">Intestines</option>
            <option value="Corneas">Corneas</option>
          </select>

          <select
            value={bloodTypeFilter}
            onChange={(e) => setBloodTypeFilter(e.target.value)}
            className={`border px-3 py-2 rounded ${
                recipientId ? "bg-gray-200 text-gray-700 cursor-not-allowed" : ""
            }`}
            disabled={recipientId !== ""}
            >
            <option value="">Filter by Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Organ(s)</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>City / Distance</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor) => (
                  <TableRow key={donor.donorId}>
                    <TableCell>{donor.donorId}</TableCell>
                    <TableCell>
                      {donor.organsAvailable.map((org, i) => (
                        <Badge key={i} variant="outline" className="mr-1">
                          {org}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{donor.bloodType}</Badge>
                    </TableCell>
                    <TableCell>
                      {donor.city}{" / "}
                      {donor.distance !== null ? `(${donor.distance} km)` : "NA"}
                    </TableCell>
                    <TableCell>
                      <button
                        className={`px-3 py-1 rounded ${
                            canTransplant
                            ? "bg-green-600 text-white cursor-pointer"
                            : "bg-gray-200 text-gray-700 cursor-not-allowed"
                        }`}
                        disabled={!canTransplant}
                        onClick={async() => handleTransplant(donor)}
                        >
                        Transplant
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-4"
                  >
                    No donors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
