using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _01_creatingATextFile
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] lines = { "First line", "Second line", "Third line" };
            System.IO.File.WriteAllLines(@"D:\cOut\WriteLines.txt", lines);
        }
    }
}
