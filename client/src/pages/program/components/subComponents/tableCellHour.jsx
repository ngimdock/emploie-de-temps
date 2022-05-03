import { Box, Typography } from "@mui/material"
import { useMemo } from "react"

const TableCellHour = ({ time }) => {
  // Some handlers
  const generateHoursString = useMemo(() => {
    return `${time.start}h - ${time.end}h`
  }, [time])

  return (
    <Box
      sx={{
        minHeight: 100,
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          fontFamily: "Nunito-Bold"
        }}
      >
        {
          generateHoursString
        }
      </Typography>
    </Box>
  )
}

export default TableCellHour