<%@ WebHandler Language="C#" Class="data" %>

using System;
using System.Web;
using System.IO;
using System.Net;

public class data : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";

        string t = context.Request.QueryString["t"];
        string url = string.Empty;
        string startdate = string.Empty;
        string enddate = string.Empty;
        string starthour = string.Empty;
        string endhour = string.Empty;
        switch (t)
        {
            case "sk":
                startdate = context.Request.QueryString["sd"];
                enddate = context.Request.QueryString["ed"];
                starthour = context.Request.QueryString["sh"];
                endhour = context.Request.QueryString["eh"];
                url = string.Format("http://1664f6h203.iask.in:31728/swjsqother/Json/ST_STBPRP_B_STCD.aspx?ClassID=1&BranchID=7&begindate={0}&enddate={1}&BHour={2}&EHour={3}"
                    , startdate, enddate, starthour, endhour);
                context.Response.Write(RequestInfo(url));
                break;
            case "ggz":
                url = "http://jiekou.chengtianhuiju.com/zhanwang/Reservoir/ST_GuanGaiZhanJson.aspx?BranchID=7";
                context.Response.Write(RequestInfo(url));
                break;
            case "skwdcl":
                url = "http://jiekou.chengtianhuiju.com/zhanwang/Reservoir/SkSqJson.aspx?BranchID=7";
                context.Response.Write(RequestInfo(url));
                break;
                
            case "hl":
                startdate = context.Request.QueryString["sd"];
                enddate = context.Request.QueryString["ed"];
                starthour = context.Request.QueryString["sh"];
                endhour = context.Request.QueryString["eh"];
                url = string.Format("http://1664f6h203.iask.in:31728/swjsqother/Json/ST_STBPRP_B_STCD.aspx?ClassID=4&BranchID=0&begindate={0}&enddate={1}&BHour={2}&EHour={3}&kind=3"
                    , startdate, enddate, starthour, endhour);
                context.Response.Write(RequestInfo(url).Replace("  ", ""));
                break; 
            default:
                startdate = context.Request.QueryString["sd"];
                enddate = context.Request.QueryString["ed"];
                starthour = context.Request.QueryString["sh"];
                endhour = context.Request.QueryString["eh"];
                url = string.Format("http://1664f6h203.iask.in:31728/swjsqother/Json/ST_STBPRP_B_STCD.aspx?ClassID=2&BranchID=7&kind=12,13&begindate={0}&BHour={2}&enddate={1}&EHour={3}"
                    , startdate, enddate, starthour, endhour);
                context.Response.Write(RequestInfo(url).Replace("  ", ""));
                break; 
        }
        
        
    }

    public static string RequestInfo(string url)
    {
        System.Net.HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
        request.Method = "GET";
        request.Timeout = 600000;
        request.ContentType = "application/json;charset=UTF-8";// "application/json;charset=utf-8;";
        //byte[] btBodys = System.Text.Encoding.UTF8.GetBytes(param);
        //request.ContentLength = btBodys.Length;
        ////request.ContentType = "application/x-www-form-urlencoded";
        //request.GetRequestStream().Write(btBodys, 0, btBodys.Length);
        string strrs = ReadStringResponse(request.GetResponse());
        return strrs;
    }

    public static string ReadStringResponse(System.Net.WebResponse response)
    {
        StreamReader sr = new StreamReader(response.GetResponseStream(), System.Text.Encoding.Default); //Encoding.GetEncoding("GB2312") System.Text.Encoding.UTF8
        String retXml = sr.ReadToEnd();
        sr.Close();
        return retXml;
    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}