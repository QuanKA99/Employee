# const visObject = {
#     // Configuration for visualisation
#     options: {
#         chart_title: {
#             type: "string",
#             label: "Chart Title",
#             default: "Employee Data"
#         }
#     },

#     // Calls visualisation
#     create: function(element) {
#         element.innerHTML = "<h1>Ready to render!</h1>";
#         const script = document.createElement('script');
#         script.src = 'https://d3js.org/d3.v4.min.js';
#         script.async = true;
#         document.body.appendChild(script);
#     },

#     // Calls function when data or configuration is changed
#     updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
#         if (!data || !data.length) return;
#         console.log(data[0]);

#         // Check if D3 library is loaded
#         let intervalId = setInterval(() => {
#             if (typeof d3 !== 'undefined') {
#                 clearInterval(intervalId);
#                 renderVisualisation(data, element, doneRendering);
#             }
#         }, 100);
#     }
# };

# // Render visualisation
# function renderVisualisation(data, element, doneRendering) {
#     const margin = { top: 50, right: 50, bottom: 30, left: 120 };
#     const width = 960 - margin.left - margin.right;
#     const height = 500 - margin.top - margin.bottom;

#     const x = d3.scaleLinear().range([0, width]);
#     const y = d3.scaleBand().range([height, 0]).padding(0.1);

#     element.innerHTML = "";

#     const svg = d3.select(element)
#         .append("svg")
#         .attr("width", width + margin.left + margin.right)
#         .attr("height", height + margin.top + margin.bottom)
#         .append("g")
#         .attr("transform", `translate(${margin.left},${margin.top})`);

#     const employeeData = processData(data);
#     setDomains(x, y, employeeData);

#     drawBars(svg, x, y, employeeData);
#     addLabels(svg, x, y, employeeData);
#     addCategoryHeaders(svg, x, y, employeeData);

#     doneRendering();
# }

# // Process data to required format for the visualisation
# function processData(data) {
#     const dataMap = {};

#     data.forEach(item => {
#         const job_level = item.job_level.value;
#         const employee_status = item.employee_status.value;

#         if (!dataMap[job_level]) {
#             dataMap[job_level] = {
#                 job_level: job_level,
#                 headcount: 0,
#                 new_hires: 0,
#                 leavers: 0
#             };
#         }

#         if (employee_status === 'existing') dataMap[job_level].headcount++;
#         else if (employee_status === 'new_hire') dataMap[job_level].new_hires++;
#         else if (employee_status === 'leaver') dataMap[job_level].leavers++;
#     });

#     return Object.values(dataMap);
# }

# // Set scales for x and y axis
# function setDomains(x, y, data) {
#     const total = d3.sum(data, d => d.headcount + d.new_hires + d.leavers);
#     x.domain([0, 1]);
#     y.domain(data.map(d => d.job_level));
# }


# // Draw bars on SVG for new hire, headcount and leavers
# function drawBars(svg, x, y, data) {
#     const total = d3.sum(data, d => d.headcount + d.new_hires + d.leavers);

#     // Add new hires bars
#     svg.selectAll(".new-hires-bar")
#         .data(data)
#         .enter().append("rect")
#         .attr("class", "new-hires-bar")
#         .attr("style", "fill: #D0F0C0;")
#         .attr("x", 0)
#         .attr("y", d => y(d.job_level))
#         .attr("width", d => x(d.new_hires / total))
#         .attr("height", y.bandwidth() / 2);

#     // Add headcount bars
#     svg.selectAll(".headcount-bar")
#         .data(data)
#         .enter().append("rect")
#         .attr("class", "headcount-bar")
#         .attr("style", "fill: #8fa9dc;")
#         .attr("x", d => x(0.5 - (d.headcount / total) / 2))
#         .attr("y", d => y(d.job_level))
#         .attr("width", d => x(d.headcount / total))
#         .attr("height", y.bandwidth() / 2);

#     // Add leavers bars
#     svg.selectAll(".leavers-bar")
#         .data(data)
#         .enter().append("rect")
#         .attr("class", "leavers-bar")
#         .attr("style", "fill: #e74c3c;")
#         .attr("x", d => x(1 - d.leavers / total))
#         .attr("y", d => y(d.job_level))
#         .attr("width", d => x(d.leavers / total))
#         .attr("height", y.bandwidth() / 2);
# }

# // Add percentage label
# function addLabels(svg, x, y, data) {
#     const total = d3.sum(data, d => d.headcount + d.new_hires + d.leavers);

#     function addPercentageLabels(selection, property, xOffset, widthFactor) {
#         selection.data().forEach(d => {
#             svg.append('text')
#                 .attr('x', x(xOffset(d)) + x(widthFactor(d)) / 2)
#                 .attr('y', y(d.job_level) + y.bandwidth() / 4)
#                 .attr('font-size', '12px')
#                 .attr('text-anchor', 'middle')
#                 .text(((d[property] / total) * 100).toFixed(1) + '%');
#         });
#     }

#     addPercentageLabels(svg.selectAll('.new-hires-bar'), 'new_hires', d => 0, d => 0.04);
#     addPercentageLabels(svg.selectAll('.headcount-bar'), 'headcount', d => 0.5 - (d.headcount / total) / 2, d => d.headcount / total);
#     addPercentageLabels(svg.selectAll('.leavers-bar'), 'leavers', d => 1 - d.leavers / total, d => d.leavers / total);
# }

# // Add headers for different categories
# function addCategoryHeaders(svg, x, y, data) {
#     const total = d3.sum(data, d => d.headcount + d.new_hires + d.leavers);

#     const gap = 10;
#     svg.selectAll(".category-rect")
#         .data(data)
#         .enter().append("rect")
#         .attr("class", "category-rect")
#         .attr("fill", "none")
#         .attr("stroke", "#8fa9dc")
#         .attr("x", -120 + gap)
#         .attr("y", d => y(d.job_level))
#         .attr("width", 120 - 2 * gap)
#         .attr("height", y.bandwidth() / 2);

#     svg.selectAll(".category-label")
#         .data(data)
#         .enter().append("text")
#         .attr("class", "category-label")
#         .attr("x", -60)
#         .attr("y", d => y(d.job_level) + y.bandwidth() / 4)
#         .attr("dy", ".35em")
#         .attr("text-anchor", "middle")
#         .attr("style", "fill: black;")
#         .text(d => d.job_level);

#     function addCategoryLabel(xOffset, widthFactor, label) {
#         svg.append('text')
#             .attr('x', x(xOffset) + x(widthFactor) / 2)
#             .attr('y', -15)
#             .attr('font-size', '18px')
#             .attr('font-weight', 'bold')
#             .attr('text-anchor', 'middle')
#             .text(label);
#     }

#     const headcountWidthFactor = data[0].headcount / total;

#     addCategoryLabel(0, 0, 'New Hires');
#     addCategoryLabel(0.5 - headcountWidthFactor / 2, headcountWidthFactor, 'Headcount');
#     addCategoryLabel(1 - data[0].leavers / total, 0, 'Leavers');
# }

# // Register visualisation on Looker
# looker.plugins.Visualisations.add(visObject);
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.hello_world=t():e.hello_world=t()}(window,(function(){return function(e){var t={};function n(l){if(t[l])return t[l].exports;var o=t[l]={i:l,l:!1,exports:{}};return e[l].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,l){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:l})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var l=Object.create(null);if(n.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(l,o,function(t){return e[t]}.bind(null,o));return l},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=28)}({28:function(e,t){looker.plugins.visualizations.add({id:"hello_world",label:"Hello World",options:{font_size:{type:"string",label:"Font Size",values:[{Large:"large"},{Small:"small"}],display:"radio",default:"large"}},create:function(e,t){e.innerHTML="\n      <style>\n        .hello-world-vis {\n          /* Vertical centering */\n          height: 100%;\n          display: flex;\n          flex-direction: column;\n          justify-content: center;\n          text-align: center;\n        }\n        .hello-world-text-large {\n          font-size: 72px;\n        }\n        .hello-world-text-small {\n          font-size: 18px;\n        }\n      </style>\n    ";var n=e.appendChild(document.createElement("div"));n.className="hello-world-vis",this._textElement=n.appendChild(document.createElement("div"))},updateAsync:function(e,t,n,l,o,r){if(this.clearErrors(),0!=l.fields.dimensions.length){var i=e[0][l.fields.dimensions[0].name];this._textElement.innerHTML=LookerCharts.Utils.htmlForCell(i),"small"==n.font_size?this._textElement.className="hello-world-text-small":this._textElement.className="hello-world-text-large",r()}else this.addError({title:"No Dimensions",message:"This chart requires dimensions."})}})}})}));
