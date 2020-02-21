+(function(d3) {
    var swatches = (function(el) {
      var w = window.innerWidth,
        h = window.innerHeight * 0.90;
  
      var circleWidth = 70;
  
      var palette = {
        lightgray: "#819090",
        gray: "#708284",
        mediumgray: "#536870",
        darkgray: "#475B62",
        darkblue: "#0A2933",
        darkerblue: "#042029",
        paleryellow: "#FCF4DC",
        paleyellow: "#EAE3CB",
        yellow: "#A57706",
        orange: "#BD3613",
        red: "#D11C24",
        pink: "#C61C6F",
        blue1: "#1766A6",
        blue2: "#80C6FF",
        purple: "#595AB7",
        blue: "#2176C7",
        green: "#259286",
        white: "#fefefe",
        yellowgreen: "#738A05",
        violet: "#AE80FF"
      };
  
      var nodes = [
        {
          name1: "first",
          name2: "ThingsFirst",
          target: [1],
          metalink: "/firstthingsfirst"
        },
        {
          name1: "t-data",
          name2: "Manager",
          target: [2],
          metalink: "/tdatamanager"
        },
        {
          name1: "t",
          name2: "Simulator",
          target: [3],
          metalink: "/tsimulator"
        },
        {
          name1: "manual",
          name2: "Analyst",
          target: [4],
          metalink: "/manualanalyst"
        },
        {
          name1: "strategic",
          name2: "Analyst",
          target: [5],
          metalink: "/strategicanalyst"
        },
        {
          name1: "real",
          name2: "TimeAnalyst",
          target: [6],
          metalink: "/realtimeanalyst"
        },
        {
          name1: "strategic",
          name2: "OrderPlacer",
          target: [7],
          metalink: "/strategicorderplacer"
        },
        {
          name1: "realTime",
          name2: "OrderPlacer",
          target: [8],
          metalink: "/realtimeorderplacer"
        },
        {
          name1: "manual",
          name2: "OrderPlacer",
          target: [9],
          metalink: "/manualorderplacer"
        },
        {
          name1: "tRecord",
          name2: "Keeping",
          target: [0],
          metalink: "/trecordkeeping"
        }
      ];
  
      var links = [];
  
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].target !== undefined) {
          for (var x = 0; x < nodes[i].target.length; x++) {
            links.push({
              source: nodes[i],
              target: nodes[nodes[i].target[x]]
            });
          }
        }
      }
  
      var myChart = d3
        .select(el)
        .append("svg")
        .attr("width", w)
        .attr("height", h);
  
      var force = d3.layout
        .force()
        .nodes(nodes)
        .links([])
        .gravity(0.05)
        .charge(-700)
        .size([w, h]);
  
      var link = myChart
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", palette.white);
  
      var node = myChart
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("g")
        .call(force.drag);
  
      node
        .append("circle")
        .attr("metalink", function(d) {
          return d.metalink;
        })
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        })
        .attr("r", circleWidth)
        .attr("stroke", function(d, i) {
          if (i > 0) {
            return palette.blue1;
          } else {
            return "transparent";
          }
        })
        .attr("stroke-width", 2)
        .attr("fill", function(d, i) {
            return palette.white;
        });
  
      node
        .append("text")
        .attr("dy", "-1em")
        .text(function(d) {
          return d.name1;
        })
        .attr("font-family", "'Ruthie', cursive")
        .attr("font-weight", "bold")
        .attr("fill", function(d, i) {
            return palette.violet;
        })
        .attr("text-anchor", "middle")
        .attr("font-size", function(d, i) {
            return "1.5em";
        });

	    node
        .append("text")
        .attr("dy", "1em")
        .text(function(d) {
          return d.name2;
        })
        .attr("font-family", "'Ruthie', cursive")
        .attr("font-weight", "bold")
        .attr("fill", function(d, i) {
            return palette.violet;
        })
        .attr("text-anchor", "middle")
        .attr("font-size", function(d, i) {
            return "1.5em";
        });
  
      force.on("tick", function(e) {
        node.attr("transform", function(d, i) {
          return "translate(" + d.x + ", " + d.y + ")";
        });
  
        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });
      });
  
      force.start();
    })("#entiresite");
  })(window.d3);
