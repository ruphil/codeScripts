using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace _02_creatingAVideo
{
    class Program
    {
        static void Main(string[] args)
        {
            var path = @"D:\cIn\img.jpg";
            var newPath = @"D:\cOut\img.png";
            Bitmap image = new Bitmap(path);

            // Do some processing
            for (int x = 0; x < image.Width; x++)
            {
                for (int y = 0; y < image.Height; y++)
                {
                    Color pixelColor = image.GetPixel(x, y);
                    Color newColor = Color.FromArgb(pixelColor.G, pixelColor.B, pixelColor.R);
                    image.SetPixel(x, y, newColor);
                }
            }

            // Save it again with a different name
            image.Save(newPath);
        }
    }
}
