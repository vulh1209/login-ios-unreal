export const getRedirectUrl = ()=>{
  const base64 = window.location.href.includes("#") && !window.location.href.includes("_pid") ? window.location.href.split("#")[1] :"";
  if(sessionStorage.getItem("redirectUrl"))
    return sessionStorage.getItem("redirectUrl");
  if(!base64)
    return sessionStorage.getItem("redirectUrl");  
  const dataBase64 = JSON.parse(Buffer.from(base64!, 'base64').toString('binary'));
  sessionStorage.setItem("redirectUrl", dataBase64.init.redirectUrl);
  return  dataBase64.init.redirectUrl;
}