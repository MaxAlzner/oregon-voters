/*globals $, d3 */

(function () {
    'use strict';
    
    var width = 960;
    var height = 600;
    
    var projection = d3.geoAlbersUsa()
        .translate([2160, 1250])
    	.scale([6000]);
				   
    var path = d3.geoPath()
        .projection(projection);
	
    var color = d3.scaleLinear()
        .range(['rgb(213,222,217)','rgb(69,173,168)','rgb(84,36,55)','rgb(217,91,67)']);
    
    var svg = d3.select('#chart-container')
        .append('svg')
        .attr('id', 'chart')
    	.attr('width', width)
    	.attr('height', height);
    
    d3.json('data.json', function (response) {
        var data = response.data.map(function (row) {
            return {
                county: row[8],
                srcode: row[9],
                srdesc: row[10],
                congcode: row[11],
                congdesc: row[12],
                party: row[13],
                partycount: parseInt(row[14], 10) || 0
            };
        });
        console.log(data);
        var counties = {};
        data.forEach(function (row) {
            var key = row.county.toLowerCase();
            if (counties[key] === undefined)
                counties[key] = {
                    democrat: 0,
                    republican: 0,
                    independant: 0,
                    green: 0,
                    libertarian: 0,
                    none: 0,
                    other: 0
                };
            switch (row.party) {
                case 'Democrat':
                    counties[key].democrat += row.partycount;
                    break;
                case 'Republican':
                    counties[key].republican += row.partycount;
                    break;
                case 'Independent Party':
                    counties[key].independant += row.partycount;
                    break;
                case 'Pacific Green':
                    counties[key].green += row.partycount;
                    break;
                case 'Libertarian':
                    counties[key].libertarian += row.partycount;
                    break;
                case 'Nonaffiliated':
                    counties[key].none += row.partycount;
                    break;
                default:
                    counties[key].other += row.partycount;
                    break;
            }
        });
        console.log(counties);
        
        d3.json('counties.json', function(geo) {
            svg
                .append('g')
                .attr('class', 'map')
                .attr('transform', 'rotate(-16)')
                .selectAll('path')
            	.data(geo.features)
            	.enter()
            	.append('path')
            	.attr('d', path)
            	.attr('class', 'county')
            	.style('stroke', '#444')
            	.style('stroke-width', '1')
            	.style('fill', function(d) {
            	    var county = counties[d.properties.name.replace(' County, OR', '').toLowerCase()];
            	    if (county) {
            	        return $.Color('red').transition('blue', county.democrat / (county.republican + county.democrat));
            	    }
            	    
            	    return 'rgb(213,222,217)';
        	    })
        	    .attr('data-name', function (d) {
        	        return d.properties.name.replace(' County, OR', '');
        	    })
        	    .attr('data-geoid', function (d) {
        	        return d.properties.geoid;
        	    });
        	
        	$('#chart')
        	    .on('mouseover', '.county', function () {
        	        $(this).css('opacity', '0.5');
        	    })
        	    .on('mouseout', '.county', function () {
        	        $(this).css('opacity', '');
        	    });
        });
    });
}());