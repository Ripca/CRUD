'use strict'

const iDBRequest=indexedDB.open("ripca",1);

iDBRequest.addEventListener("upgradeneeded", e=>{
    const db=iDBRequest.result;
    db.createObjectStore("nombres",{
        autoIncrement: true
    });

})

iDBRequest.addEventListener("success", ()=>{
    verObjeto()
    console.log("todosBIen")
})

iDBRequest.addEventListener("error", ()=>{
    console.log("todosmal");
})

document.getElementById("add").addEventListener("click", ()=>{
   let nombre=document.getElementById("name").value;
   if (nombre.length>0) {
        if (document.querySelector(".posible")!=undefined) {            
           if (confirm("ELementos sin guardar, continuar?")) {
               addObjeto({nombre})
               verObjeto();
           }
        }else{
            addObjeto({nombre})
            verObjeto();
        }
    }
})

const addObjeto=objeto=>{
    const IDBData=getIDBData("readwrite","objeto agregado")
    IDBData.add(objeto)  
}

const verObjeto=()=>{
    const IDBData=getIDBData("readonly","Datos leidos22")
    const cursor=IDBData.openCursor();
    const fragment=document.createDocumentFragment();
    document.querySelector(".nombres").innerHTML="";
    cursor.addEventListener("success", ()=>{
        if (cursor.result) {
            let elemento=nombresHTML(cursor.result.key,cursor.result.value);
            fragment.appendChild(elemento)
            cursor.result.continue()
        }else document.querySelector(".nombres").appendChild(fragment)   
    })  
    
}

const modificarObjeto=(key,objeto)=>{
    const IDBData=getIDBData("readwrite","objeto modificado")
    IDBData.put(objeto,key)

}

const eliminarObjeto=key=>{
    const IDBData=getIDBData("readwrite","objeto eliminado")
    IDBData.delete(key)
    
}

const getIDBData=(mode,msg)=>{
    const db=iDBRequest.result;
    const IDBtransaction=db.transaction("nombres",mode);
    const objectStore=IDBtransaction.objectStore("nombres");
    IDBtransaction.addEventListener("complete", ()=>{
        console.log(msg)
    })    

    return objectStore
}

const nombresHTML=(id, name)=>{
    const container=document.createElement("DIV")
    const h2=document.createElement("h2")
    const options=document.createElement("DIV")
    const saveButton=document.createElement("button")
    const deleteButton=document.createElement("button")

    container.classList.add("nombre");
    options.classList.add("options");
    saveButton.classList.add("imposible");
    deleteButton.classList.add("delete");

    saveButton.textContent="Guardar";
    deleteButton.textContent="Borrar"
    
    h2.textContent=name.nombre;
    h2.setAttribute("contenteditable", "true")
    h2.setAttribute("spellcheck", "false")

    options.appendChild(saveButton)
    options.appendChild(deleteButton)
    
    container.appendChild(h2)
    container.appendChild(options)


    h2.addEventListener("keyup", ()=>{
        saveButton.classList.replace("imposible", "posible")
    })


    saveButton.addEventListener("click",()=>{
        if (saveButton.className=="posible") {
            modificarObjeto(id,{nombre:h2.textContent})
            saveButton.classList.replace("posible", "imposible")
        }
    })

    deleteButton.addEventListener("click", ()=>{
        eliminarObjeto(id);
        document.querySelector(".nombres").removeChild(container)
    })

    return container;
}









    


