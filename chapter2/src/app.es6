/**
 * TodoItem Model
 * @param {object} data
 * @constructor
 */
var TodoItem = function (data) {
	this.description = m.prop(data.description);
	this.done = m.prop(false);
};

/**
 * list method
 * @returns {Array}
 */
TodoItem.list = function () {
	var tasks = [];
	var src = localStorage.getItem("todo");
	if (src) {
		var json = JSON.parse(src);
		for (var i = 0; i < json.length; i++) {
			tasks.push(new TodoItem(json[i]));
		}
	}
	return m.prop(tasks);
};

/**
 * save method
 * @param {TodoItem[]} todoList
 */
TodoItem.save = function (todoList) {
	localStorage.setItem("todo",
		JSON.stringify(todoList.filter(function (todo) {
			return !todo.done();
		})));
};

/**
 * view model
 */
var vm = {
	init: ()=> {
		vm.list = TodoItem.list();
		vm.description = m.prop("");

		/**
		 * add item
		 */
		vm.add = function () {
			if (vm.description()) {
				vm.list().push(new TodoItem({description: vm.description()}));
				vm.description("");
				TodoItem.save(vm.list());
			}
		};

		/**
		 * checked this item
		 */
		vm.check = function () {
			this.done(true);
			TodoItem.save(vm.list());
		};
	}
};

/**
 * controller
 */
function controller() {
	vm.init()
}


/**
 * view
 * @returns {*}
 */
function view() {
	return m("div", [
		m("input", {onchange: m.withAttr("value", vm.description), value: vm.description()}),
		m("button", {onclick: vm.add}, "追加"),
		m("table", vm.list().map(function (task) {
			return m("tr",
				m("label",
					m("td",
						m("input[type=checkbox]", {onclick: m.withAttr("checked", vm.check.bind(task)), value: task.done()})
					),
					m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description())
				)
			);
		}))
	]);
}

m.mount(document.getElementById("root"), {controller: controller, view: view});

