 class Index {
    constructor(){
        this.search ='';
        this.userTable = [];
        this.tableHead = ['Email','Name','Surname'];
    }
     getUsers(){
         fetch('http://localhost:3000/users').then((response)=>{
             return response.json();
         }).then((data)=>{
             this.userTable = data;
             this.render();
             this.buttonAction();
             this.router();
         });
     }
    rerender(){
        document.body.querySelector('header').remove();
        document.body.querySelector('main').remove();
    }
     router(){
         let routes = [...document.querySelectorAll('.main-nav>a')];
         for(let i=0;i<routes.length;i++){
             let route = routes[i];
             route.addEventListener('click',(event) =>{
                 event.preventDefault();
                 index.rerender();
                 if (route.getAttribute('href')=='main.html'){
                     index.render();
                 }
                 else if(route.getAttribute('href')=='keypad.html'){
                     keypad.render();
                     keypad.buttonAction();
                 }
                 else if(route.getAttribute('href')=='edit-contact.html'){
                     editContact.render();
                 }
                 else if((route.getAttribute('href')=='user.html')){
                     user.render();
                 }else if((route.getAttribute('href')=='add-user.html')){
                     addUser.render();
                 }
             })
         }
         //console.log(routes);
     }
    buttonAction() {
        //удаление через backspace в поиске
        document.body.querySelector('.form-control').addEventListener('keydown',(event)=>{
            if (!event.key.search('Backspace')) {
               this.search = this.search.slice(0,-1);
                let filteredTable = this.userTable.filter(element => {
                    return element.firstName.search(new RegExp(`^${this.search}`)) !==-1?true:false;
                });
                document.body.querySelector('tbody').innerHTML = this.tbody(filteredTable);
            }
        });
        //ввод через клавиатуру
        document.body.querySelector('.form-group').addEventListener('keydown',(event)=>{
            if(event.key.length==1) {
                this.search += event.key;
                let filteredTable = this.userTable.filter(element => {
                    return element.firstName.search(new RegExp(`^${this.search}`)) !==-1?true:false;
                });
                document.body.querySelector('tbody').innerHTML = this.tbody(filteredTable);
            }
        });
        //сортировка таблицы
        document.body.querySelector('thead').addEventListener('click', (event) => {
            if (event.target.tagName == 'TH') {
                let target = event.target.textContent.toLowerCase();
                this.userTable.sort((a, b)=> {
                    if(a[target] == b[target]) return 1;
                    return a[target].localeCompare(b[target])
                });
                 document.body.querySelector('tbody').innerHTML = this.tbody(this.userTable);
            }
            if(event.target.tagName == 'input'){

            }
        })
    }
    header(){
        return `<header class = 'header'>
                    <div class="container top-radius">
                        <h2>Contacts</h2>
                    </div>
                </header>`
    }
    tableHeadParse(){
        let layout = ``;
        for(let i=0;i<this.tableHead.length;i++){
            layout+=`<th>${this.tableHead[i]}</th>`
        }
        return layout;
    }
    rowParse(table){
        let layout =``;
        for(let i=0;i<table.length;i++){
            let collectionElement = table[i];
            layout+=`<tr>`;
            layout+=`<td>${collectionElement.firstName}</td>
                    <td>${collectionElement.lastName}</td>
                    <td>${collectionElement.email}</td>`;
            layout+=`</tr>`;
        }
        return layout;
    }
    thead(){
        return `<thead>
                    <tr>
                        ${this.tableHeadParse()}
                    </tr>
                </thead>`;
    }
    tbody(table){
        return `<tbody>
                    ${this.rowParse(table)}
                </tbody>`;
    }
    table(table){
        return`<table class="table table-hover contacts">
                                    ${this.thead()} 
                                    ${this.tbody(table)}
                            </table>`;
    }
    main(){
        return`<main><div class="container">
                            <form class="form-inline search-form">
                                <div class="form-group">
                                    <label class="sr-only" for="search">Search</label>
                                    <input type="text" class="form-control" value='' id="search" placeholder="Search">
                                </div>
                                ${this.table(this.userTable)}
                            </form>
                            
              </div></main>`
    }
    body(){
        return`${this.header()+this.main()}`;
    }
    render(){
        let footer = document.body.querySelector('footer');
        footer.insertAdjacentHTML('beforebegin',this.body());
        return this
    }
 }
 let index = new Index();
index.getUsers();