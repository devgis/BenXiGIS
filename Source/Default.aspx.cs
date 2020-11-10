using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Net;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;

public partial class _Default : System.Web.UI.Page
{
    //构建json类
    public class JsonData
    {

        public string Program_class { get; set; }
        public string NumberNo { get; set; }
        public string NumberNoUrL { get; set; }

        public string Program_Ico { get; set; }
        public string Program_NAME { get; set; }
        public string Program_Wburl { get; set; }


        public string Program_ID { get; set; }
        public string isLogin { get; set; }
        public string MarkNo { get; set; }

        public string MarkName { get; set; }
        public string Program_checkbox { get; set; }
        public string UnreadNumber { get; set; }
    }

    public class JsonData2
    {

        public string Program_class { get; set; }
        public string NumberNo { get; set; }
        public string NumberNoUrL { get; set; }

        public string Program_Ico { get; set; }
        public string Program_NAME { get; set; }
        public string Program_Wburl { get; set; }


        public string Program_ID { get; set; }
        public string isLogin { get; set; }
        public string MarkNo { get; set; }

        public string MarkName { get; set; }
        public string Program_checkbox { get; set; }
        public string UnreadNumber { get; set; }
    }

    protected string SysCaidan;
		
    public static string Left(string sSource, int iLength)
    {
        return sSource.Substring(0, iLength > sSource.Length ? sSource.Length : iLength);
    }

    public static string Right(string sSource, int iLength)
    {
        return sSource.Substring(iLength > sSource.Length ? 0 : sSource.Length - iLength);
    }

    public static string Mid(string sSource, int iStart, int iLength)
    {
        int iStartPoint = iStart > sSource.Length ? sSource.Length : iStart;
        return sSource.Substring(iStartPoint, iStartPoint + iLength > sSource.Length ? sSource.Length - iStartPoint : iLength);
    }
    protected string SysName;
    protected void Page_Load(object sender, EventArgs e)
    {
        string purl = "http://yingyong1.chengtianhuiju.com/api/menu_pc.aspx?programid=2729&UserID=2354";

        string n_html = "";
        Encoding encoding = Encoding.GetEncoding("utf-8");
        n_html = GetWebContent(purl, encoding);
        //构建json对象
       // string jsonstring="[ {posid:'611',city:'成都市'}, {posid:'621',city:'上海市'}, {posid:'631',city:'重庆市'}, {posid:'641',city:'海口市'} ]";
        string jsonstring = n_html;
        int a = n_html.IndexOf("Items");

        SysName = Left(n_html, a);
        SysName = SysName.Replace("App_Name", "");
        SysName = SysName.Replace("{", "");
        SysName = SysName.Replace("\"", "");
        SysName = SysName.Replace(":", "");
        SysName = SysName.Replace(",", "");

        string jsonstringok = Mid(n_html, a+7, n_html.Length - a-23);
        jsonstringok = Left(jsonstringok, jsonstringok.Length - 1);
        jsonstringok = jsonstringok.Replace("[]", "\"\"");
        jsonstringok = jsonstringok.Replace("\"Program_class\"", "Program_class");
        jsonstringok = jsonstringok.Replace("\"NumberNo\"", "NumberNo");
        jsonstringok = jsonstringok.Replace("\"NumberNoUrL\"", "NumberNoUrL");
        jsonstringok = jsonstringok.Replace("\"Program_Ico\"", "Program_Ico");
        jsonstringok = jsonstringok.Replace("\"Program_NAME\"", "Program_NAME");
        jsonstringok = jsonstringok.Replace("\"Program_Wburl\"", "Program_Wburl");
        jsonstringok = jsonstringok.Replace("\"Program_ID\"", "Program_ID");
        jsonstringok = jsonstringok.Replace("\"isLogin\"", "isLogin");
        jsonstringok = jsonstringok.Replace("\"MarkNo\"", "MarkNo");
        jsonstringok = jsonstringok.Replace("\"MarkName\"", "MarkName");
        jsonstringok = jsonstringok.Replace("\"UnreadNumber\"", "UnreadNumber");
        jsonstringok = jsonstringok.Replace("\"", "\'");
        jsonstringok = jsonstringok.Replace("],", "]");

        //Response.Write(jsonstringok+ "<br>");
        //Response.End();

        //将json数据转换成Json数组
        //JavaScriptSerializer 需引用System.Web.Script.Serialization;
        JsonData[] data = new JavaScriptSerializer().Deserialize<JsonData[]>(jsonstringok);


        //获取json数据中某个值
        //获取json数据长度
        int len = data.Length;
        //Response.Write(len.ToString() + "<br>");
        for (int i = 0; i < data.Length; i++)
        {

            SysCaidan=SysCaidan + "<li><a href=\"#\">"+data[i].Program_NAME+"</a>";
            string purl2="http://yingyong1.chengtianhuiju.com/api/menu_pc.aspx?programid="+data[i].Program_ID+"&UserID=2354";
           // Response.Write(purl2 + "<br>");
            Encoding encoding2 = Encoding.GetEncoding("utf-8");
            string n_html2 = GetWebContent(purl2, encoding2);
            int a2 = n_html2.IndexOf("没有找到记录");
            if (a2 == -1)
            {
                int a22 = n_html2.IndexOf("Items");
                string jsonstringok2 = Mid(n_html2, a22+7, n_html2.Length - a22-23);
                jsonstringok2 = Left(jsonstringok2, jsonstringok2.Length - 1);
                jsonstringok2 = jsonstringok2.Replace("[]", "\"\"");
                jsonstringok2 = jsonstringok2.Replace("\"Program_class\"", "Program_class");
                jsonstringok2 = jsonstringok2.Replace("\"NumberNo\"", "NumberNo");
                jsonstringok2 = jsonstringok2.Replace("\"NumberNoUrL\"", "NumberNoUrL");
                jsonstringok2 = jsonstringok2.Replace("\"Program_Ico\"", "Program_Ico");
                jsonstringok2 = jsonstringok2.Replace("\"Program_NAME\"", "Program_NAME");
                jsonstringok2 = jsonstringok2.Replace("\"Program_Wburl\"", "Program_Wburl");
                jsonstringok2 = jsonstringok2.Replace("\"Program_ID\"", "Program_ID");
                jsonstringok2 = jsonstringok2.Replace("\"isLogin\"", "isLogin");
                jsonstringok2 = jsonstringok2.Replace("\"MarkNo\"", "MarkNo");
                jsonstringok2 = jsonstringok2.Replace("\"MarkName\"", "MarkName");
                jsonstringok2 = jsonstringok2.Replace("\"UnreadNumber\"", "UnreadNumber");
                jsonstringok2 = jsonstringok2.Replace("\"", "\'");
                jsonstringok2 = jsonstringok2.Replace("],", "]");


                JsonData[] data2 = new JavaScriptSerializer().Deserialize<JsonData[]>(jsonstringok2);
                //Response.Write(jsonstringok2 + "<br><br><br><br>");
                SysCaidan=SysCaidan + "<ul class=\"one\">";
                for (int i2 = 0; i2 < data2.Length; i2++)
                {
                    
                    string purl4 = "http://yingyong1.chengtianhuiju.com/api/menu_pc.aspx?programid=" + data2[i2].Program_ID + "&UserID=2354";
                   // Response.Write(purl4+"<br>");
                    Encoding encoding3 = Encoding.GetEncoding("utf-8");
                    string n_html3 = GetWebContent(purl4, encoding3);
                    int a3 = n_html3.IndexOf("没有找到记录");
                    if (a3 == -1)
                    {

                        if (data2[i2].Program_checkbox.Trim() == "1")
                        {
                            SysCaidan = SysCaidan + " <li><a href=\"#\" class=\"more\">" + data2[i2].Program_NAME + " <input type=\"checkbox\" id=\"checkbox"+ data2[i2].Program_ID +"\"></a>";
                        }
                        else
                        {
                            SysCaidan = SysCaidan + " <li><a href=\"#\" class=\"more\">" + data2[i2].Program_NAME + "</a>";
                        }

                        int a33 = n_html3.IndexOf("Items");
                        string jsonstringok3 = Mid(n_html3, a33 + 7, n_html3.Length - a33 - 23);
                        jsonstringok3 = Left(jsonstringok3, jsonstringok3.Length - 1);
                        jsonstringok3 = jsonstringok3.Replace("[]", "\"\"");
                        jsonstringok3 = jsonstringok3.Replace("\"Program_class\"", "Program_class");
                        jsonstringok3 = jsonstringok3.Replace("\"NumberNo\"", "NumberNo");
                        jsonstringok3 = jsonstringok3.Replace("\"NumberNoUrL\"", "NumberNoUrL");
                        jsonstringok3 = jsonstringok3.Replace("\"Program_Ico\"", "Program_Ico");
                        jsonstringok3 = jsonstringok3.Replace("\"Program_NAME\"", "Program_NAME");
                        jsonstringok3 = jsonstringok3.Replace("\"Program_Wburl\"", "Program_Wburl");
                        jsonstringok3 = jsonstringok3.Replace("\"Program_ID\"", "Program_ID");
                        jsonstringok3 = jsonstringok3.Replace("\"isLogin\"", "isLogin");
                        jsonstringok3 = jsonstringok3.Replace("\"MarkNo\"", "MarkNo");
                        jsonstringok3 = jsonstringok3.Replace("\"MarkName\"", "MarkName");
                        jsonstringok3 = jsonstringok3.Replace("\"UnreadNumber\"", "UnreadNumber");

                        jsonstringok3 = jsonstringok3.Replace("\"NoUrL\"", "NoUrL");

                        jsonstringok3 = jsonstringok3.Replace("\"", "\'");
                        jsonstringok3 = jsonstringok3.Replace("],", "]");



                        jsonstringok3 = jsonstringok3.Replace("NoUrL: '11'", "");
                        jsonstringok3 = jsonstringok3.Replace("NoUrL: '22'", "");
                        jsonstringok3 = jsonstringok3.Replace("NoUrL: '33'", "");
                        jsonstringok3 = jsonstringok3.Replace("NoUrL: '44'", "");
                        jsonstringok3 = jsonstringok3.Replace("NoUrL: '55'", "");

                        jsonstringok3 = jsonstringok3.Replace(" ", "");
                        jsonstringok3 = jsonstringok3.Replace("\n", "");
                        jsonstringok3 = jsonstringok3.Trim();

                        jsonstringok3 = jsonstringok3.Replace("UnreadNumber:'0'", "UnreadNumber:'0'|");

                        jsonstringok3 = jsonstringok3.Replace("[", "");
                        jsonstringok3 = jsonstringok3.Replace("]", "");
                        jsonstringok3 = jsonstringok3.Replace("{", "");
                        jsonstringok3 = jsonstringok3.Replace("}", "");
                        jsonstringok3 = jsonstringok3.Replace("NumberNoUrL:", " NumberNoUrL:\'\',");

                        jsonstringok3 = Left(jsonstringok3, jsonstringok3.Length - 3);
                        jsonstringok3 = jsonstringok3.Replace("|", "} ");
                        jsonstringok3 = jsonstringok3.Replace("Program_class", "{Program_class");
                        jsonstringok3 = "[" + jsonstringok3 + "}]";

                        jsonstringok3 = jsonstringok3.Replace("'','',", "'',");

                        //Response.Write(jsonstringok3 + "<br><br>");
                        JsonData2[] data3 = new JavaScriptSerializer().Deserialize<JsonData2[]>(jsonstringok3);

                        SysCaidan = SysCaidan + "    <ul class=\"two\">";
                        for (int i3 = 0; i3 < data3.Length; i3++)
                        {
                            if (data3[i3].Program_checkbox.Trim() == "1")
                            {
                                SysCaidan = SysCaidan + "    <li><a href=\"#\">" + data3[i3].Program_NAME + " <input type=\"checkbox\" id=\"checkbox"+ data3[i3].Program_ID +"\"></a>";
                            }
                            else
                            {
                                SysCaidan = SysCaidan + "    <li><a href=\"#\">" + data3[i3].Program_NAME + "</a></li>";
                            }
                        }
                        SysCaidan = SysCaidan + "   </ul>";
                        SysCaidan = SysCaidan + "   </li>";
                    }
                    else
                    {
                        if (data2[i2].Program_checkbox.Trim() == "1")
                        {
                            SysCaidan = SysCaidan + " <li><a href=\"#\">" + data2[i2].Program_NAME + " <input type=\"checkbox\" id=\"checkbox"+ data2[i2].Program_ID +"\"></a>";
                        }
                        else
                        {
                            SysCaidan = SysCaidan + " <li><a href=\"#\">" + data2[i2].Program_NAME + "</a></li>";
                        }
                    }


                 }

                SysCaidan=SysCaidan + "</ul>";
              }
              SysCaidan=SysCaidan + "</li>";

        }
        //Response.Write(SysCaidan + "<br>");
        //Response.End();


    }
    //根据Url地址得到网页的html源码
    private string GetWebContent(string Url, Encoding encoding)
    {
        string strResult = "";
        try
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);
            //声明一个HttpWebRequest请求
            request.Timeout = 30000;
            //设置连接超时时间
            request.Headers.Set("Pragma", "no-cache");
            // request.Headers.Set("KeepAlive", "true");
            request.CookieContainer = new CookieContainer();
            request.Credentials = CredentialCache.DefaultCredentials;
            request.Referer = Url;

            request.UserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream streamReceive = response.GetResponseStream();

            StreamReader streamReader = new StreamReader(streamReceive, encoding);
            strResult = streamReader.ReadToEnd();
            streamReceive.Close();
            streamReader.Close();
            streamReceive = null;
            streamReader = null;
        }
        catch
        {
            return "";
        }
        return strResult;
    }

    public static string RemoveHTML(string Htmlstring)
    {
        //删除脚本   
        Htmlstring = Regex.Replace(Htmlstring, @"<script[^>]*?>.*?</script>", "", RegexOptions.IgnoreCase);
        //删除HTML   
        Htmlstring = Regex.Replace(Htmlstring, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"([\r\n])[\s]+", "", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"-->", "", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"<!--.*", "", RegexOptions.IgnoreCase);

        Htmlstring = Regex.Replace(Htmlstring, @"&(quot|#34);", "\"", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(amp|#38);", "&", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(lt|#60);", "<", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(gt|#62);", ">", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(nbsp|#160);", "   ", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(iexcl|#161);", "\xa1", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(cent|#162);", "\xa2", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(pound|#163);", "\xa3", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(copy|#169);", "\xa9", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&#(\d+);", "", RegexOptions.IgnoreCase);

        Htmlstring.Replace("<", "");
        Htmlstring.Replace(">", "");
        Htmlstring.Replace("\r\n", "");
        Htmlstring = HttpContext.Current.Server.HtmlEncode(Htmlstring).Trim();

        return Htmlstring;
    }
    //'截取字符串
    public string strCut(string strContent, string StartStr, string EndStr)
    {
        string strHtml;
        int S1;
        int S2;
        strHtml = strContent;

        S1 = strHtml.IndexOf(StartStr);//  IndexOf   InStr(strHtml,StartStr)
        S2 = strHtml.IndexOf(EndStr);
        return strHtml.Substring(S1 + StartStr.Length, S2 - S1 - EndStr.Length);
    }


    private string GetGeneralContent(string strUrl)
    {

        string strMsg = string.Empty;

        try
        {

            WebRequest request = WebRequest.Create(strUrl);

            WebResponse response = request.GetResponse();

            StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.GetEncoding("utf-8"));
            strMsg = reader.ReadToEnd();
            reader.Close();
            reader.Dispose();
            response.Close();

        }

        catch

        { }

        return strMsg;

    }
}