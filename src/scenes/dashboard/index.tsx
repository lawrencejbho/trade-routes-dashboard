import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";

import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
} from "@/types";

type Props = {
  data: GetKpisResponse[];
  data2: GetProductsResponse[];
  data3: GetTransactionsResponse[];
};

const gridTemplateLargeScreens = `
"a b c"
"a b c"
"a b c"
"a b f"
"d e f"
"d e f"
"d h i"
"g h i"
"g h j"
"g h j"
`;

const gridTemplateSmallScreens = `
"a"
"a"
"a"
"a"
"b"
"b"
"b"
"b"
"c"
"c"
"c"
"d"
"d"
"d"
"e"
"e"
"f"
"f"
"f"
"g"
"g"
"g"
"h"
"h"
"h"
"h"
"i"
"i"
"j"
"j"
`;

function Dashboard({ data, data2, data3 }: Props) {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
  return (
    <Box
      width="100%"
      height="100%"
      display="grid"
      gap="1.5rem"
      sx={
        isAboveMediumScreens
          ? {
              gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
              gridTemplateRows: "repeat(10, minmax(60px,1fr))",
              gridTemplateAreas: gridTemplateLargeScreens,
            }
          : {
              gridAutocolumns: "1fr",
              gridAutoRows: "80px",
              gridTemplateAreas: gridTemplateSmallScreens,
            }
      }
    >
      <Row1 data={data} />
      <Row2 data={data} data2={data2} />
      <Row3 data={data} data2={data2} data3={data3} />
    </Box>
  );
}

export default Dashboard;
