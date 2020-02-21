package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/360EntSecGroup-Skylar/excelize"
)

func main() {
	xlsx, _ := excelize.OpenFile("./gkEnglishFormatted.xlsx")
	rows := xlsx.GetRows("Sheet1")
	maxRows := 5000

	numOfManualEntries := 0
	xlsxNew := excelize.NewFile()
	for i, row := range rows {
		currenRow := (i + 1)

		if currenRow > maxRows {
			break
		}

		rowQID := "A" + strconv.Itoa(i+1)
		ques := row[0]
		qNo := strconv.Itoa(currenRow%20) + "."
		if qNo == "0." {
			qNo = "20."
		}

		if strings.Contains(ques, qNo) {
			quesMod := strings.TrimSpace(strings.Replace(ques, qNo, "", 1))
			xlsxNew.SetCellValue("Sheet1", rowQID, quesMod)
		} else {
			rowQMrkID := "E" + strconv.Itoa(i+1)
			xlsxNew.SetCellValue("Sheet1", rowQMrkID, "?")
		}

		if currenRow%20 == 0 {

			ansString := strings.TrimSpace(row[1])
			ansStrforOptions := ansString

			rowStrID := "C" + strconv.Itoa(currenRow)
			rowDotID := "D" + strconv.Itoa(currenRow)
			xlsxNew.SetCellValue("Sheet1", rowStrID, ansString)
			xlsxNew.SetCellValue("Sheet1", rowDotID, ".")

			numOfOptions := 0
			for optionNum := 10; optionNum <= 20; optionNum++ {
				indexStr := strconv.Itoa(optionNum) + "."
				if strings.Contains(ansStrforOptions, indexStr) {
					numOfOptions++
					ansStrforOptions = strings.Replace(ansStrforOptions, indexStr, "", -1)
				}
			}

			for optionNum := 1; optionNum <= 9; optionNum++ {
				indexStr := strconv.Itoa(optionNum) + "."
				if strings.Contains(ansStrforOptions, indexStr) {
					numOfOptions++
				}
			}

			if numOfOptions == 20 {
				var options []string
				for i := 1; i <= 20; i++ {
					startStr := strconv.Itoa(i) + "."
					endStr := strconv.Itoa(i+1) + "."
					tempStr := strings.Split(ansString, startStr)[1]
					optionStr := strings.Split(tempStr, endStr)[0]
					options = append(options, optionStr)
				}

				optionNum := 0
				for tempRowNo := currenRow - 19; tempRowNo < currenRow-19+20; tempRowNo++ {
					rowAnsID := "B" + strconv.Itoa(tempRowNo)
					xlsxNew.SetCellValue("Sheet1", rowAnsID, options[optionNum])
					optionNum++
				}
			} else {
				numOfManualEntries++
				for tempRowNo := currenRow - 19; tempRowNo < currenRow-19+20; tempRowNo++ {
					rowAnsID := "B" + strconv.Itoa(tempRowNo)
					xlsxNew.SetCellValue("Sheet1", rowAnsID, ".")
				}
				fmt.Println("Problematic Row: ", currenRow)
			}
			fmt.Println(currenRow/20, "Set Over")
			// break
		} else {

			rowStrID := "C" + strconv.Itoa(currenRow)
			xlsxNew.SetCellValue("Sheet1", rowStrID, ".")
		}
	}
	fullPath := "./gkNew.xlsx"
	xlsxNew.SaveAs(fullPath)
	fmt.Println("Manual Entries: ", numOfManualEntries)
	fmt.Println("Fully Over")

}
