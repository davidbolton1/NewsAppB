const quoteAddress = `https://quotes.rest/quote/search?&minlength=30&maxlength=800&query=${query}&private=false`
const app_key = 'B_amwVnizcdaqfBbr1uboAeF' // app_key parameter
const query = 'Trump'; // Date parameter


async function findSimilarQuotes() {

    const searchAddress = `https://quotes.rest/quote/search?&minlength=30&maxlength=800&query=${query}&private=false`

let settings = {
    
        "Accept": "application/json",
        "X-TheySaidSo-Api-Secret": "B_amwVnizcdaqfBbr1uboAeF"
      
}
const quoteResponse = await fetch(`${searchAddress}`, settings)
.then((quoteResponse) => {
    console.log(quoteResponse)
}

)
}
