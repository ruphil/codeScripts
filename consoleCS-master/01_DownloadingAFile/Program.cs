using System;
using System.Net;

namespace _01_DownloadingAFile
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            using (WebClient wc = new WebClient())
            {
                wc.DownloadFile(
                    new System.Uri("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"),
                    "D:\\cat.jpg"
                );
            }
            Console.WriteLine("Downloaded!");
        }
    }
}
