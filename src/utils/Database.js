import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);
// SQLite.deleteDatabase

const database_name = "Reactoffline.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;
export default class Database {

  stockDatabase(){
    return new Promise((resolve,reject) => {
    SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    ).then(db=>{
    db.transaction(function (txn) {
      console.log('txn',txn);
            txn.executeSql(
        "SELECT * FROM sqlite_master WHERE  type='table' AND name='STOCK_TABLE'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length >= 0) {
            txn.executeSql('DROP TABLE IF EXISTS STOCK_TABLE', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS STOCK_TABLE(stock_id INTEGER PRIMARY KEY AUTOINCREMENT, item_description, item_group, bookedqty, reorderlevel,updatedate ,name,pkgunit,childunit,instockqty,orgid,pkgunitrate,itemcode,itemskuflag,iteminfoflag,itemmasterrowkey,itemschemeflag,pkgid)',
              []
            ).then(()=>{
              resolve(db);
            })
          }
          
        }
      );
      // txn.executeSql(
      //   "SELECT 1  FROM sqlite_master WHERE type='table' AND name='STOCK_TABLE'").then(()=>{
      //     resolve(db);
      //   }).catch((error) =>{
      //     db.transaction((tx) => {
      //         tx.executeSql('CREATE TABLE IF NOT EXISTS STOCK_TABLE(stock_id INTEGER PRIMARY KEY AUTOINCREMENT, item_description, item_group, bookedqty, reorderlevel,updatedate ,name,pkgunit,childunit,instockqty,orgid)');
      //     }).then(() => {
      //       resolve(db);
      //       console.log('table created');
      //     }).catch(error => {
            
      //     });
      // });

    })
  });
}).catch(err=>{
  console.log('error in stock db',err);
})
  };
  customerDatabase(){
    return new Promise((resolve,reject) => {
    SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    ).then(db=>{
    db.transaction(function (txn) {
      console.log('txn',txn);
            txn.executeSql(
        "SELECT * FROM sqlite_master WHERE  type='table' AND name='CUSTOMER_TABLE'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length >= 0) {
            txn.executeSql('DROP TABLE IF EXISTS CUSTOMER_TABLE', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS CUSTOMER_TABLE(customer_id INTEGER PRIMARY KEY AUTOINCREMENT,city, type, name, orggroup,zoneid,state,typecus,country,orgid,loginid,emailid,contactno)',
              []
            ).then(()=>{
              // alert('SQLite Database and Table Successfully Created...');
              resolve(db);
            })
          }
         
        }
      );
    })
  });
}).catch(err=>{
  console.log('error in stock db',err);
})
  };

  customerTimeDatabase(){
    return new Promise((resolve,reject) => {
    SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    ).then(db=>{
    db.transaction(function (txn) {
      console.log('txn',txn);
      txn.executeSql(
        "SELECT *  FROM sqlite_master WHERE type='table' AND name='CUSTOMER_TABLE_TIME'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length >= 0) {
            txn.executeSql('DROP TABLE IF EXISTS CUSTOMER_TABLE_TIME', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS CUSTOMER_TABLE_TIME(count_id INTEGER PRIMARY KEY AUTOINCREMENT,time,count)',
              []
            ).then(succ=>{
              resolve(db);
            })
          }
       
        }
      );
    })
  });
}).catch(err=>{
  console.log('error in stock db',err);
})
  };
  stockTimeDatabase(){
    return new Promise((resolve,reject) => {
    SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    ).then(db=>{
    db.transaction(function (txn) {
      console.log('txn',txn);
        txn.executeSql(
          "SELECT * FROM sqlite_master WHERE  type='table' AND name='STOCK_TABLE_TIME'",
          [],
          function (tx, res) {
            console.log('item:', res);
            if (res.rows.length >= 0) {
              txn.executeSql('DROP TABLE IF EXISTS STOCK_TABLE_TIME', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS STOCK_TABLE_TIME(count_id INTEGER PRIMARY KEY AUTOINCREMENT,time,count)',
                []
              ).then(succ=>{
                resolve(db);
              })
            }
            // resolve(db);
          }
        );
    })
  });
}).catch(err=>{
  console.log('error in stock db',err);
})
  };
    initDB() {
        let db;
        return new Promise((resolve) => {
          SQLite.echoTest()
            .then(() => {
              SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
              )
                .then(DB => {
                  db = DB;  
                  console.log('opening databasw')
                  db.executeSql('SELECT 1 FROM STOCK_TABLE LIMIT 1').then(() => {
                    console.log('table existes')
                  }).catch((error) =>{
                      db.transaction((tx) => {
                          tx.executeSql('CREATE TABLE IF NOT EXISTS STOCK_TABLE (stock_id INTEGER PRIMARY KEY AUTOINCREMENT, item_description, item_group, bookedqty, reorderlevel,updatedate ,name,pkgunit,childunit,instockqty,orgid)');
                      }).then(() => {
                        console.log('table created');
                      }).catch(error => {
                      });
                  });
                  resolve(db);
                })
                .catch(error => {
                });
            })
            .catch(error => {
            });
          });
      };
      initCustomerDB() {
        let db;
        return new Promise((resolve) => {
          SQLite.echoTest()
            .then(() => {
              SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
              )
                .then(DB => {
                  db = DB;  
                  console.log('opening databasw')
                  db.executeSql('SELECT 1 FROM CUSTOMER_TABLE LIMIT 1').then(() => {
                    console.log('table existes')
                  }).catch((error) =>{
                      db.transaction((tx) => {
                          tx.executeSql('CREATE TABLE IF NOT EXISTS CUSTOMER_TABLE (city, type, name, orggroup,zoneid,state,typecus,country,orgid,loginid,emailid,contactno)');
                      }).then(() => {
                        console.log('table created');
                      }).catch(error => {
                      });
                  });
                  resolve(db);
                })
                .catch(error => {
                });
            })
            .catch(error => {
            });
          });
      };
      initStockTimeDB() {
        let db;
        return new Promise((resolve) => {
          SQLite.echoTest()
            .then(() => {
              SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
              )
                .then(DB => {
                  db = DB;  
                  db.executeSql('SELECT 1 FROM STOCK_TABLE_TIME LIMIT 1').then(() => {
                  }).catch((error) =>{
                      db.transaction((tx) => {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS STOCK_TABLE_TIME (count_id INTEGER PRIMARY KEY AUTOINCREMENT,time,count)');
                      }).then(() => {
                      }).catch(error => {
                      });
                  });
                  resolve(db);
                })
                .catch(error => {
                });
            })
            .catch(error => {
            });
          });
      };
     
      initCustomerTableTimeDB() {
        let db;
        return new Promise((resolve) => {
          SQLite.echoTest()
            .then(() => {
              SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
              )
                .then(DB => {
                  db = DB;  
                  db.executeSql('SELECT 1 FROM CUSTOMER_TABLE_TIME LIMIT 1').then(() => {
                  }).catch((error) =>{
                      db.transaction((tx) => {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS CUSTOMER_TABLE_TIME (count_id INTEGER PRIMARY KEY AUTOINCREMENT,time,count)');
                      }).then(() => {
                      }).catch(error => {
                      });
                  });
                  resolve(db);
                })
                .catch(error => {
                });
            })
            .catch(error => {
            });
          });
      };

  insertDataStock = (item) => {
     return new Promise((resolve,reject) => {
    this.stockDatabase().then((db) => {
       item.forEach((valueItem,index)=>{
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO STOCK_TABLE(item_description, item_group, bookedqty, reorderlevel,updatedate ,name,pkgunit,childunit,instockqty,orgid,pkgunitrate,itemcode,itemskuflag,iteminfoflag,itemmasterrowkey,itemschemeflag,pkgid) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [valueItem.itemdescription,valueItem.itemgroup,valueItem.bookedqty,valueItem.reorderlevel,valueItem.updatedate,valueItem.itemname,valueItem.pkgunit,valueItem.childpkgunit,valueItem.instockqty,valueItem.orgid,valueItem.pkgunitrate,valueItem.itemcode,valueItem.itemskuflag,valueItem.iteminfoflag,valueItem.itemmasterrowkey,valueItem.itemschemeflag,valueItem.pkgid,],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            resolve(results);
          } else alert('Failed....');
        }
      );
    });
})
}).catch((err) => {
  });
});
  }
  insertDataTimeStock = (count,time) => {
    return new Promise((resolve,reject) => {
   this.stockTimeDatabase().then((db) => {
   db.transaction(function (tx) {
     tx.executeSql('INSERT INTO STOCK_TABLE_TIME(time,count) VALUES(?,?)',[time,count],(tx,result)=>{
       if (result.rowsAffected > 0) {
        resolve(result);
      } else alert('Failed....');
     });
})
}).catch((err) => {
 });
});
 }

 insertDataTimeCustomer = (count,time) => {
  return new Promise((resolve,reject) => {
this.customerTimeDatabase().then((db) => {
db.transaction(function (tx) {
  tx.executeSql('INSERT INTO CUSTOMER_TABLE_TIME(time,count) VALUES(?,?)',[time,count],(tx,result)=>{
    if (result.rowsAffected > 0) {
      resolve(result);
    } else alert('Failed....');
  })
})
}).catch((err) => {
});
});
}
  insertDataCustomer = (itemName) => {
    return new Promise((resolve,reject) => {
  this.customerDatabase().then((db) => {
     itemName.forEach((valueItem,index)=>{
  db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO CUSTOMER_TABLE(city, type, name, orggroup,zoneid,state,typecus,country,orgid,loginid,emailid,contactno) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
      [valueItem.city,valueItem.type,valueItem.name,valueItem.orggroup,valueItem.zoneid,valueItem.state,valueItem.orgtypename,valueItem.country,valueItem.orgid,valueItem.loginid,valueItem.emailid,valueItem.contactno],
      (tx, results) => {    
        if (results.rowsAffected > 0) {
          resolve(results);
        } else alert('Failed....');
      }
    );
  });
})
}).catch((err) => {
  console.log(err);
});
});
}
  retrieveStock = (offset) => {
   return new Promise((resolve,reject)=>{
 this.initDB().then((db) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM STOCK_TABLE LIMIT 800 OFFSET ${offset} `,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i){
            temp.push(results.rows.item(i));
          }
          resolve(temp);
        }
      );
    });
});
});
  }
  searchInStockTable=(text)=>{
    let name=text;
    return new Promise((resolve,reject)=>{
      this.initDB().then((db) => {
         db.transaction((tx) => {
           tx.executeSql(
             `SELECT * FROM STOCK_TABLE WHERE name LIKE '%${name}%' OR instockqty LIKE '%${name}%' OR pkgunit LIKE '%${name}%' OR reorderlevel LIKE '%${name}%'`,
             [],
             (tx, results) => {
               var temp = [];
               for (let i = 0; i < results.rows.length; ++i){
                 temp.push(results.rows.item(i));
               }
               console.log('the searching data',temp);
               resolve(temp);
             }
           );
         });
     });
     }); 
  }
  searchInCustomerTable=(text)=>{
    let name=text;
    return new Promise((resolve,reject)=>{
      this.initCustomerDB().then((db) => {
         db.transaction((tx) => {
           tx.executeSql(
             `SELECT * FROM CUSTOMER_TABLE WHERE name LIKE '%${name}%' OR orggroup LIKE '%${name}%' OR type LIKE '%${name}%'`,
             [],
             (tx, results) => {
               var temp = [];
               for (let i = 0; i < results.rows.length; ++i){
                 temp.push(results.rows.item(i));
               }
               console.log('the searching data',temp);
               resolve(temp);
             }
           );
         });
     });
     }); 
  }
  retrieveCustomer = () => {
    return new Promise((resolve,reject)=>{
  this.initDB().then((db) => {
     db.transaction((tx) => {
       tx.executeSql(
         'SELECT * FROM CUSTOMER_TABLE',
         [],
         (tx, results) => {
           var temp = [];
           for (let i = 0; i < results.rows.length; ++i){
             temp.push(results.rows.item(i));
           }
           resolve(temp);
         }
       );
     });
 });
 });
   }
   retrieveCustomerTime = () => {
    return new Promise((resolve,reject)=>{
  this.initCustomerTableTimeDB().then((db) => {
     db.transaction((tx) => {
       tx.executeSql(
         'SELECT * FROM CUSTOMER_TABLE_TIME',
         [],
         (tx, results) => {
           var temp = [];
           for (let i = 0; i < results.rows.length; ++i){
             temp.push(results.rows.item(i));
           }
           resolve(temp);
         }
       );
     });
 });
 });
   }
   retrieveStockTime = () => {
    return new Promise((resolve,reject)=>{
  this.initStockTimeDB().then((db) => {
     db.transaction((tx) => {
       tx.executeSql(
         'SELECT DISTINCT * FROM STOCK_TABLE_TIME',
         [],
         (tx, results) => {
           var temp = [];
           for (let i = 0; i < results.rows.length; ++i){
             temp.push(results.rows.item(i));
           } 
           resolve(temp);
         }
       );
     });
 });
 });
   }

      closeDatabase(db) {
        if (db) {
          db.close()
            .then(status => {
            })
            .catch(error => {
              this.errorCB(error);
            });
        } else {
        }
      };

      deleteStockTable(){
        return new Promise((resolve,reject)=>{
        this.stockDatabase().then((db) => {
            db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM STOCK_TABLE',
              );
              resolve();
            });
        });
      });
      }
      deleteStockTimeTable(){
        return new Promise((resolve,reject)=>{
        this.stockTimeDatabase().then((db) => {
            db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM STOCK_TABLE_TIME',
              );
              resolve();
            });
        });
      });
      }

      deleteCustomerTable(){
        return new Promise((resolve,reject)=>{
        this.customerDatabase().then((db) => {
            db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM CUSTOMER_TABLE',
              );
              resolve();
            });
        });          
      });
      }
      deleteCustomerTimeTable(){
        return new Promise((resolve,reject)=>{
        this.customerTimeDatabase().then((db) => {
            db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM CUSTOMER_TABLE_TIME',
              );
              resolve();
            });
        });
      });
      }
}