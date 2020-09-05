from kivy.app import App
from kivy.uix.gridlayout import GridLayout
from kivy.properties import ( ObjectProperty, StringProperty )

import tkinter as tk
from tkinter import filedialog

from osgeo import ogr


class ToolLayout(GridLayout):
    parentgdbPath = StringProperty()

    def __init__(self, **kwargs):
        super(ToolLayout, self).__init__(**kwargs)
        self.parentgdbPath = "X://Parent GDB Path/"
        self.bind(parentgdbPath=self.open_gdb)

    def get_parentpath(self):
        root = tk.Tk()
        root.withdraw()

        tempDir = filedialog.askdirectory()
        if tempDir != "" and tempDir.lower().endswith('.gdb'):
            self.parentgdbPath = tempDir
        
    def open_gdb(self, instance, value):
        print("opening_gdb")
        print("Chosen item in ", instance, " was modified to : ", value)

        driver = ogr.GetDriverByName("FileGDB")
        print(driver)
        # ds = driver.Open(r"C:\temp\buildings.gdb", 0)


class ArcpyApp(App):
    def build(self):
        return ToolLayout()


if __name__ == '__main__':
    ArcpyApp().run()