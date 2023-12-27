//Creamos la base de datos y la abrimos
const iDBRequest = indexedDB.open("DataBase", 1);

//Si la base de datos fue creada exitosamente creamos ahora un ObjectStoratge o tabla llamada nombres
iDBRequest.addEventListener("upgradeneeded", (e) => {
    const db = iDBRequest.result;
    db.createObjectStore("nombres", {
        autoIncrement: true,
    });
});

//Funcion que va creando cada elemento necesario y le agrega las clases correspondientes para luego mostrarlo en pantalla con un determinado estilo
const nombresHTML = (id, name) => {
    const container = document.createElement("DIV");
    const h2 = document.createElement("h2");
    const options = document.createElement("DIV");
    const saveButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    container.classList.add("nombre");
    options.classList.add("options");
    saveButton.classList.add("imposible");
    deleteButton.classList.add("delete");

    saveButton.textContent = "Guardar";
    deleteButton.textContent = "Borrar";

    h2.textContent = name.nombre;
    h2.setAttribute("contenteditable", "true");
    h2.setAttribute("spellcheck", "false");

    options.appendChild(saveButton);
    options.appendChild(deleteButton);

    container.appendChild(h2);
    container.appendChild(options);

    h2.addEventListener("keyup", () => {
        saveButton.classList.replace("imposible", "posible");
    });

    saveButton.addEventListener("click", () => {
        if (saveButton.className == "posible") {
            modificarObjeto(id, { nombre: h2.textContent });
            saveButton.classList.replace("posible", "imposible");
        }
    });

    deleteButton.addEventListener("click", () => {
        eliminarObjeto(id);
        document.querySelector(".nombres").removeChild(container);
    });

    return container;
};

//Funcion que recorre la tabla y crea un un nuevo hijo en el contenedor nombres que es donde se van a visualizar los datos posteriormente
const verObjeto = () => {
    const IDBData = getIDBData("readonly", "Datos leidos correctamente");
    const cursor = IDBData.openCursor();
    const fragment = document.createDocumentFragment();
    document.querySelector(".nombres").innerHTML = "";
    cursor.addEventListener("success", () => {
        if (cursor.result) {
            let elemento = nombresHTML(cursor.result.key, cursor.result.value);
            fragment.appendChild(elemento);
            cursor.result.continue();
        } else document.querySelector(".nombres").appendChild(fragment);
    });
};

//Si la request fue exitosa llamamos a la funcion para ver el object o tabla
iDBRequest.addEventListener("success", () => {
    verObjeto();
});

//Mostramos el error en consola si algo salio mal con la request
iDBRequest.addEventListener("error", (e) => {
    console.log(e);
});

//Funcion que administra las consultas
const getIDBData = (mode, msg) => {
    const db = iDBRequest.result;
    const IDBtransaction = db.transaction("nombres", mode);
    const objectStore = IDBtransaction.objectStore("nombres");
    IDBtransaction.addEventListener("complete", () => {
        console.log(msg);
    });

    return objectStore;
};

//Funcion para agregar un nuevo registro y corroborar si hay cambios en algun otro registro
document.getElementById("add").addEventListener("click", () => {
    let nombre = document.getElementById("name").value;
    if (nombre.length > 0) {
        if (document.querySelector(".posible") != undefined) {
            if (confirm("Elementos sin guardar, quieres continuar?")) {
                addObjeto({ nombre });
                verObjeto();
            }
        } else {
            addObjeto({ nombre });
            verObjeto();
        }
    }
});

//Creamos el objeto con la consulta readwrite
const addObjeto = (objeto) => {
    const IDBData = getIDBData("readwrite", "Objeto agregado");
    IDBData.add(objeto);
};

//Modificamoos un objeto con la consulta readwrite y con el el metodo put
const modificarObjeto = (key, objeto) => {
    const IDBData = getIDBData("readwrite", "Objeto modificado");
    IDBData.put(objeto, key);
};

//Eliminamos el objeto con el delete
const eliminarObjeto = (key) => {
    const IDBData = getIDBData("readwrite", "Objeto eliminado");
    IDBData.delete(key);
};
