export const protectedApi = async ()=>{
    const result = await fetch(`/api/protected`);
    const data = await result.json();
    console.log(data)
    return data
}