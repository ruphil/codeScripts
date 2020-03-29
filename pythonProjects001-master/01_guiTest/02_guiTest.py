import sys
from PyQt5 import QtCore, QtGui, QtWidgets, uic

# uiPath = "D:/pyIn/tax_calc.ui"
uiPath = "res/tax_calc.ui"

Ui_MainWindow, QtBaseClass = uic.loadUiType(uiPath)

class MainWindow(QtWidgets.QMainWindow, Ui_MainWindow):
    def __init__(self):
        QtWidgets.QMainWindow.__init__(self)
        self.setupUi(self)

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
    