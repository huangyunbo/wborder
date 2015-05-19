/*
 * Date:2015-05-19
 * Name:DisoSi
 */

(function ($) {

$.extend({
	webpage: function() {
		//$.webpage({"id":"paging","pagecurrent":1,"totalrows":100,"pagesize":10,"callback":"abc"});
		
		var o = arguments[0];
		if(o.totalrows == 0){//如果等于0就不执行
			$("#" + o.id).hide();
			return false;
		}
		$("#" + o.id).show();
		var page_size_html = "";
		var page_number_html = "";
		var totalpage = Math.ceil(o.totalrows / o.pagesize);
		var page_previous;
		var page_next;
		var pagecurrent_html = '<a class="n selected" data-page="' + o.pagecurrent + '">' + o.pagecurrent + '</a>';
		function i_html(i) {
			return '<a class="n" data-page="' + i + '">' + i + '</a>'
		}

		//1.生成选择页码下拉列表
		page_size_html = '<div class="page_size">'
							+ '每页显示：'
							+ '<select>'
								+ '<option ' + (o.pagesize == 10 ? 'selected="selected"' : '') + ' value="10">10</option>'
								+ '<option ' + (o.pagesize == 20 ? 'selected="selected"' : '') + ' value="20">20</option>'
								+ '<option ' + (o.pagesize == 50 ? 'selected="selected"' : '') + ' value="50">50</option>'
							+ '</select>'
						+ '</div>';

		//2.生成“上一页”按钮
		page_number_html += '<div class="page_number">';
		if (o.pagecurrent > 1 && totalpage > 1) {
			page_previous = o.pagecurrent - 1;
			page_number_html += '<a class="n" data-page="' + page_previous + '">上一页</a>';
		}

		//3.生成页码
		if (totalpage < 11){//3.1 总页数小于11，显示(上一页 1 2 3 4 5 6 7 8 9 10 下一页)
			for (var i = 1; i <= totalpage; i++) {
				if (i == o.pagecurrent) {
					page_number_html += pagecurrent_html;
				} else {
					page_number_html += i_html(i);
				}
			}
		} else if (o.pagecurrent < 6) {//3.2.1 总页数大于11,且当前页码小于6，显示(上一页 1 2 3 4 5 6 ... 25 下一页)
			for (var i = 1; i < 7; i++) {
				if (i == o.pagecurrent) {
					page_number_html += pagecurrent_html;
				} else {
					page_number_html += i_html(i);
				}
			}
			page_number_html += '<a class="n dot">...</a>';
			page_number_html += i_html(totalpage);
		} else if (o.pagecurrent > totalpage - 5) {//3.2.2 上一页 1 ... 21 22 23 24 25 下一页
			page_number_html += i_html(1);
			page_number_html += '<a class="n dot">...</a>';
			for (var i = totalpage - 4; i <= totalpage; i++) {
				if (i == o.pagecurrent) {
					page_number_html += pagecurrent_html;
				} else {
					page_number_html += i_html(i);
				}
			}
		} else {//3.3.3 上一页 1 2 ... 15 16 17 18 19 ... 100 101 下一页
			for (var i = 1; i <= 2; i++) {
				page_number_html += i_html(i);
			}
			page_number_html += '<a class="n dot">...</a>';
			for (var i = o.pagecurrent - 2; i < o.pagecurrent + 3; i++) {
				if (i == o.pagecurrent) {
					page_number_html += pagecurrent_html;
				} else {
					page_number_html += i_html(i);
				}
			}
			page_number_html += '<a class="n dot">...</a>';
			for (var i = totalpage - 1; i <= totalpage; i++) {
				page_number_html += i_html(i);
			}
		}

		//4.生成下一页
		if (o.pagecurrent < totalpage && totalpage > 1) {
			page_next = o.pagecurrent + 1;
			page_number_html += '<a class="n" data-page="' + page_next + '">下一页&gt;</a>';
		}

		$("#" + o.id).children().remove();
		$("#" + o.id).html(page_size_html + page_number_html);



		//点击翻页回调
		$("#" + o.id).children(".page_number").on("click", "a.n,a.page_prev,a.page_next", function () {
			var _page = parseInt($(this).attr("data-page"));
			if (isNaN(_page)) return;
			eval(o.callback + "(" + _page + "," + o.pagesize + ")");
		});
		//改变每页大小
		$("#" + o.id).children(".page_size").on("change", "select", function () {
			var _val = parseInt($(this).children("option:selected").val());
			if (isNaN(_val)) return;
			var _newpagecurrent = Math.ceil((o.pagecurrent * o.pagesize - o.pagesize + 1) / _val); //重新计算当前页
			eval(o.callback + "(" + _newpagecurrent + "," + _val + ")");
		});
		//跳指定页
		$("#" + o.id).children(".page_number").on("keyup", "input.text", function (e) {
			var _val = parseInt($(this).val());
			if (isNaN(_val)) return;
			if (_val < 1 || _val > totalpage) return;
			if (e.keyCode == 13) {
				eval(o.callback + "(" + _val + "," + o.pagesize + ")");
			}
		});
		$("#" + o.id).children(".page_number").on("click", ".page_btn", function () {
			var _val = parseInt($(this).siblings("input.text").val());
			if (isNaN(_val)) return;
			if (_val < 1 || _val > totalpage) return;
			eval(o.callback + "(" + _val + "," + o.pagesize + ")");
		});
	}
});
})(jQuery)