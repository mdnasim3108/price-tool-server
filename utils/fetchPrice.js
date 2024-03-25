const axios=require("axios")
const fetchPrice= async(product,productName,skuName,reservationTerm)=>{
   const res=await axios.get(`https://prices.azure.com/api/retail/prices?$filter=serviceFamily eq '${product.serviceFamily}' and serviceName eq '${product.serviceName}' and armRegionName eq '${product.region}' and productName eq '${productName}' and skuName eq '${skuName}' and ${reservationTerm=="PAYG"?"type eq 'Consumption'":"reservationTerm eq "+`'${reservationTerm}'`} `)
    return res.data.Items[0].retailPrice
}
module.exports={fetchPrice}  