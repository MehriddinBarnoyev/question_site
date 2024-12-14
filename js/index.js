console.log('Hello, World!');
axios.get("https://opentdb.com/api.php?amount=10").then((res)=>{
    console.log(res.data.results);
    
})
