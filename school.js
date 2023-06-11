let lesson_url = "http://localhost:3000/collection/lessons"
let order_url = "http://localhost:3000/collection/orders";
var webstore = new Vue({
  el: "#app",
  data: {
    showProduct: true,
    lowHigh: "Ascending",
    cart: [],
    cart2: {},
    searchInput: "",
    sortBy: "--Sort By--",
    name: "",
    number: "",
    schools: [],

  },
  methods: {
    addToCart(school) {
      this.cart.push(school);
      school.availableInventory -= 1;
      console.log(this.cart);

      if (Object.keys(this.cart2).includes(school.id)){
        this.cart2[school.id] += 1

      } else {
        this.cart2[school.id] = 1
      }
    },

    canAddToCart: function (school) {
      return school.availableInventory > this.cartCount(school.id);
    },
    cartCount: function (id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
      // return this.cart.length || '';
    },
    showCheckout() {
      this.showProduct = this.showProduct ? false : true;
    },
    checkOut() {
      let show = this.cart;
      return show;
    },

    removeCartItem(id) {
      let showcart = this.cart;
      let less = this.school;
      for (let i = 0; i < showcart.length; i++) {
        console.log(showcart[i].id);
        if (id == showcart[i].id) {
          showcart.splice(i, 1);
        }
      }
      for (let i = 0; i < less.length; i++) {
        console.log(less[i].id);
        if (id == less[i].id) {
          less[i].stock += 1;
        }
      }
    },

    placeOrder() {
      let showcart = this.cart;
      console.log(this.cart2, 'cart count')

      let order = {
        "name":this.name, "number":this.number
      };
      let update_array = {};
      let orderObj = {};

      const get_obj_id = (p_id) => {
        let product = this.schools.find((obj) => obj.id == p_id);
        orderObj[product._id] = this.cart2[p_id];
        //add the object to be updated with the id and space
        update_array[product._id] =
          product.availableInventory - this.cart2[p_id];
      };


      Object.keys(this.cart2).forEach(get_obj_id);

      //adds ordered products id and spaces to order object
      order["order"] = orderObj;

      //post request to add order to the order collection
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      };

      const update_num_space = (p_id) => {
        update_url = lesson_url + "/" + p_id;
        let update = {
          id: p_id,
          numberofspaces: update_array[p_id],
        };


        const options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        };


        fetch(update_url, options)
          .then((resp) => resp.json())
          .then((json) => {
            if (!json.msg === "success") {
              console.log("An Error occured!, " + p_id);
            }
          });
      };

      fetch(order_url, options)
        .then((response) => response.json())
        .then((json) => {
            Object.keys(update_array).forEach(update_num_space);
            this.cart2 = {}
            alert("Order not submitted");
       
        });

      if (this.name == "" && this.number == "" && this.cart.length == 0) {
        alert("Order not submitted");
      } else {
        alert("Order Submitted");
        this.name = "";
        this.number = "";
        showcart.splice(0, showcart.length);
      }
    },
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
    },
    sortByPrice: function (priceArray) {
      function compare(a, b) {
        if (a.price > b.price) return 1;
        if (a.price < b.price) return -1;
        return 0;
      }
      return priceArray.sort(compare);
    },
    sortBySubject: function (titleArray) {
      function compare(a, b) {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
      }
      return titleArray.sort(compare);
    },
    sortByLocation: function (locationArray) {
      function compare(a, b) {
        if (a.location > b.location) return 1;
        if (a.location < b.location) return -1;
        return 0;
      }
      return locationArray.sort(compare);
    },
    sortByAva: function (avaArray) {
      function compare(a, b) {
        if (a.availableInventory > b.availableInventory) return 1;
        if (a.availableInventory < b.availableInventory) return -1;
        return 0;
      }
      return avaArray.sort(compare);
    },

    filterLessons: function () {
      console.log(this.schoools, "should be schools");
      let lessons = this.schools;
      if (this.schools.length > 0 && this.searchInput) {
        lessons = lessons.filter((school) => {
          return (
            school.title.toLowerCase().match(this.searchInput.toLowerCase()) ||
            school.location.toLowerCase().match(this.searchInput.toLowerCase())
          );
        });
      }

      if (this.sortBy == "price") {
        lessons = this.sortByPrice(lessons);
      } else if (this.sortBy == "subject") {
        lessons = this.sortBySubject(lessons);
      } else if (this.sortBy == "location") {
        lessons = this.sortByLocation(lessons);
      } else if (this.sortBy == "stock") {
        lessons = this.sortByAva(lessons);
      }

      if (this.lowHigh == "Ascending") {
        return lessons;
      } else if (this.lowHigh == "Descending") {
        return lessons.reverse();
      }
      return lessons;
    },
  },
  computed: {
    cartItemCount: function () {
      return this.cart.length;
    },
  },
  created() {
    fetch(lesson_url)
      .then((response) => response.json())
      .then((data) => {
        this.schools = data;
        console.log(this.schools);
      });
  },
});
