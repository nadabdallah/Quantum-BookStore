class Book{
    constructor(ISBN, Title, PublishingYear, Price, Author){
        this.ISBN = ISBN;
        this.Title = Title;
        this.PublishingYear = PublishingYear;
        this.Price = Price;
        this.Author = Author; 
    }

    PrintBookInfo(){
        return `${this.Title} by ${this.Author} at (${this.PublishingYear}), ISBN: ${this.ISBN}`;
    }

    Buy(Quantity, contactInfo){
        throw new Error("Buy method is not implemented");
    }
}

class PaperBook extends Book{
    constructor(ISBN, Title, PublishingYear, Price, Author, Stock){
        super(ISBN, Title, PublishingYear, Price, Author);
        this.Stock = Stock;
    }

    Buy(Quantity,{Address}){
        if(this.Stock < Quantity){
            throw new Error(`Not enought stock for this book: ${this.Title}, Available: ${this.Stock}`);
        }
        else{
            this.Stock -= Quantity;
            ShippingService.ship(this, Address, Quantity);
            return this.Price* Quantity;
        }
    }

    PrintBookInfo(){
        return `${super.PrintBookInfo()} [Paper Book - Stock: ${this.Stock}]`;
    }
}

class EBook extends Book{
    constructor(ISBN, Title, PublishingYear, Price, Author, Filetype){
        super(ISBN, Title, PublishingYear, Price, Author);
        this.Filetype = Filetype;
    }

    Buy(Quantity, {Email}){
        if(!Email){
            throw new Error("Email is required for Ebook");
        }
        MailService.send(this, Email);
        return this.Price*Quantity;
    }

    PrintBookInfo(){
        return `${super.PrintBookInfo()} [EBook - Format: ${this.Filetype}]`;
    }
}

class DemoBook extends Book{
    constructor(ISBN, Title, PublishingYear, Author){
        super(ISBN, Title, PublishingYear, 0, Author);
        this.Price = 0;  //Price is always 0, Because demobooks are not for sale
    }

    Buy(){
        throw new Error("Demobook can not be purchased");
    }

    PrintBookInfo(){
        return `${super.PrintBookInfo()} [DemoBook - Not for sale]`;
    }
}

class ShippingService{
    static ship(book, Address, Quantity){

    }
}

class MailService{
    static send(book, Email){

    }
}


class BookStore{
    constructor(){
        this.inventory = new Map();
    }

    addBook(book){
        this.inventory.set(book.ISBN, book);
        console.log(`Added: ${book.PrintBookInfo()}`);
    }

    removeBook(years){
        const currentYear = new Date().getFullYear();
        const removed = [];
        for(const [ISBN, book ] of this.inventory){
            if((currentYear - book.PublishingYear) > years){
                this.inventory.delete(ISBN);
                removed.push(book);
                console.log(`Removed book: ${book.PrintBookInfo()}`);
            }
        }
        return removed;
    }

    buyBook(ISBN, Quantity, contactInfo={}){
        const book = this.inventory.get(ISBN);
        if(!book){
            throw new Error('This book is not found');
        }
        try{
            const totalPrice = book.Buy(Quantity, contactInfo);
            console.log(`Purchased ${Quantity} of ${book.Title} for ${totalPrice}`);
            return totalPrice;
        }
        catch(error){
            console.error(error.message);
            throw error;
        }
    }
    PrintBookStoreInfo(){
        console.log("Book Store:")
        this.inventory.forEach(book=> console.log(`${book.PrintBookInfo()}`));
    }
}

class BookStoreTest{
    static runTests(){
        const store = new BookStore();

        store.addBook(new PaperBook("123-456", "Clean Code",2008, 39.99, "Robert Martin", 10));
        store.addBook(new EBook("789-012", "Design Patterns", 1994, 29.99,  "Erich Gamma" ,"PDF"));
        store.addBook(new DemoBook("345-678", "Future Tech", 2023, "AI Collective"));

        store.PrintBookStoreInfo();

        try {
            store.buyBook("123-456", 2, { Address: "123 Main St" });
        } catch (error) {
            console.error(error.message);
        }

        try {
            store.buyBook("789-012", 1, { Email: "nadabdallah25@gmail,com" });
        } catch (error) {
            console.error(error.message);
        }

        try {
            store.buyBook("345-678", 1);
        } catch (error) {
            console.error(error.message);
        }

        store.removeBook(20);
        store.PrintBookStoreInfo();
    }
}

BookStoreTest.runTests();