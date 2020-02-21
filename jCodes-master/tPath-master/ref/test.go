package main

func jack(){

}

// package main

// import (
// 	"database/sql"
// 	"fmt"

// 	_ "github.com/lib/pq"
// )

// func main() {

// 	db, err := sql.Open("postgres", "user=postgres dbname=tPathDB sslmode=disable")
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer db.Close()

// 	err = db.Ping()
// 	if err != nil {
// 		panic(err)
// 	}

	// db.Query(`CREATE TABLE userinfo
    // (
    //     uid serial NOT NULL,
    //     username character varying(100) NOT NULL,
    //     departname character varying(500) NOT NULL,
    //     created date,
    //     CONSTRAINT userinfo_pkey PRIMARY KEY (uid)
    // )
	// WITH (OIDS=FALSE);`)
	
	// fmt.Println("reached 1")
	// db.Query("INSERT INTO userinfo (username, departname, created) VALUES ('astaxie', 'kkl', '2012-12-09')")
	// tx, _ := db.Begin()
	// stmt, _ := db.Prepare("INSERT INTO userinfo (username, departname, created) VALUES ($1, $2, $3)")
	// if err != nil {
	// 	panic(err)
	// }
	
	// defer stmt.Close()

	// fmt.Println("reached 2")
	// fmt.Println(stmt)

	// stmt.Exec("safkljsdlkf", "jflsdjflksdjf", "2018-09-12")
	// tx.Commit()
	// if err != nil {
	// 	panic(err)
	// }

    // id, _ := res.LastInsertId()

    // fmt.Println(id)

	// fmt.Println("ended")

	// rows, _ := db.Query("SELECT table_name FROM information_schema.tables")
	// defer rows.Close()

	// for rows.Next() {
    //     var name string
    //     rows.Scan(&name)
    //     fmt.Println(name)
	// }

	// fmt.Println("Successfully connected!")
// }




// import (
// 	"fmt"
// 	"runtime"
// )

// func main(){
// 	fmt.Println(runtime.NumCPU());
// }


// import (
//     "fmt"
//     "runtime"
//     "sync"
// )

// func main() {
//     runtime.GOMAXPROCS(4)

//     var wg sync.WaitGroup
//     wg.Add(2)

//     fmt.Println("Starting Go Routines")
//     go func() {
//         defer wg.Done()

//         for char := 'a'; char < 'a'+26; char++ {
//             fmt.Printf("%c ", char)
//         }
//     }()

//     go func() {
//         defer wg.Done()

//         for number := 1; number < 27; number++ {
//             fmt.Printf("%d ", number)
//         }
//     }()

//     fmt.Println("Waiting To Finish")
//     wg.Wait()

//     fmt.Println("\nTerminating Program")
// }