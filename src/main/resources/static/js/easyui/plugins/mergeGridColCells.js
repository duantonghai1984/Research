function mergeGridColCells(grid,refCols,rowFildNames)
      {
             var rows=grid.datagrid('getRows' );
             //alert(rows.length);
             //alert(rows[1][rowFildName]);
             var flag=false ;
             var startIndex=0;
             var endIndex=0;
             if(rows.length< 1)
            {
                   return;
            }
            $.each(rows, function(i,row){
              $.each(refCols, function(j,refCol){
                    if(row[refCol]!=rows[startIndex][refCol])
                    {
                          flag= false;
                          return false ;
                    }
                    else
                    {
                          flag= true;
                    }
              });
                  //if(row[rowFildName]==rows[startIndex][rowFildName])
                  if(flag)
                  {
                        endIndex=i;
                  }
                   else
                  {
                         $.each(rowFildNames, function(k,rowFildName){
                               grid.datagrid( 'mergeCells',{
                                    index: startIndex,
                                    field: rowFildName,
                                    rowspan: endIndex -startIndex+1,
                                    colspan: null
                              });
                         });
                       
                        startIndex=i;
                        endIndex=i;
                  }
            });
            $.each(rowFildNames, function(k,rowFildName){
                   grid.datagrid( 'mergeCells',{
                              index: startIndex,
                              field: rowFildName,
                              rowspan: endIndex -startIndex+1,
                              colspan: null
                        });
          });
      }
