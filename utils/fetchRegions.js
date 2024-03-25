const axios=require("axios")
const fetchRegions= async()=>{
   const res=await axios.get("https://prices.azure.com/api/retail/prices?$filter=serviceFamily eq 'Compute' and serviceName eq 'Virtual Machines' and productName eq 'Virtual Machines Dv3 Series' and skuName eq 'D8 v3' and type eq 'Consumption'")
    return res.data.Items.map(data=>data.location)
}
module.exports={fetchRegions} 