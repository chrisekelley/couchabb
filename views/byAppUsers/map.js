function (doc) {
        if (doc.app_id && doc.control_database) { // multi channel mode
          emit(doc.full_name, {
            name : (doc.full_name || doc.name), 
            control_database : doc.control_database
          })
        }
      }