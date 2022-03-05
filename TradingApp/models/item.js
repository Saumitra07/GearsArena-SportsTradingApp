const e = require('express');
const { DateTime } = require('luxon');
const { v4: uuid } = require('uuid');

const trades = [{
    categoryId:'1',
    categoryName:'Football',
    items: [{
        itemId: '1',
        itemName: 'Ball',
        itemDescription: 'This is American football made by Nike. It has a classic look with Synthetic leather and it offers good grip in all weather conditions.  Ball is used for almost 1 year and is in good condition.',
        itemImage: '/images/football1.jpg',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        itemId: '2',
        itemName: 'Helmet',
        itemDescription: 'This is American football made by Nike. It has a classic look with Synthetic leather and it offers good grip in all weather conditions.  Ball is used for almost 1 year and is in good condition.',
        itemImage: '/images/football2.jpg',
        createdAt: DateTime.local(2022, 01, 31).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        itemId: '3',
        itemName: 'Shoulder Pads',
        itemDescription: 'This is American football made by Nike. It has a classic look with Synthetic leather and it offers good grip in all weather conditions.  Ball is used for almost 1 year and is in good condition.',
        itemImage: '/images/football3.jpg',
        createdAt: DateTime.local(2022, 01, 31).toLocaleString(DateTime.DATETIME_SHORT)
    }
    ]
    }, 
{

    categoryId:'2',
    categoryName:'Golf',
    items: [{
        itemId: '4',
        itemName: 'Ball',
        itemDescription: 'This is American football made by Nike. It has a classic look with Synthetic leather and it offers good grip in all weather conditions.  Ball is used for almost 1 year and is in good condition.',
        itemImage: '/images/golf1.jpg',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        itemId: '5',
        itemName: 'Bag',
        itemDescription: 'This is American football made by Nike. It has a classic look with Synthetic leather and it offers good grip in all weather conditions.  Ball is used for almost 1 year and is in good condition.',
        itemImage: '/images/golf2.jpg',
        createdAt: DateTime.local(2022, 01, 29).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        itemId: '6',
        itemName: 'Golf Set',
        itemDescription: 'This is American football made by Nike. It has a classic look with Synthetic leather and it offers good grip in all weather conditions.  Ball is used for almost 1 year and is in good condition.',
        itemImage: '/images/golf3.jpg',
        createdAt: DateTime.local(2022, 01, 21).toLocaleString(DateTime.DATETIME_SHORT)
    }
    ]

}, {    
    categoryId:'3',
    categoryName:'Baseball',
    items: [{
        itemId: '7',
        itemName: 'Bat',
        itemDescription: 'This is American football made by Nike. It has a classic look with Synthetic leather and it offers good grip in all weather conditions.  Ball is used for almost 1 year and is in good condition.',
        itemImage: '/images/baseball1.jpeg',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        itemId: '8',
        itemName: 'Helmet',
        itemDescription: 'This is American football made by Nike. It has a classic look with Synthetic leather and it offers good grip in all weather conditions.  Ball is used for almost 1 year and is in good condition.',
        itemImage: '/images/baseball2.jpeg',
        createdAt: DateTime.local(2022, 02, 01).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        itemId: '9',
        itemName: 'Gloves',
        itemDescription: 'This is American football made by Nike. It has a classic look with Synthetic leather and it offers good grip in all weather conditions.  Ball is used for almost 1 year and is in good condition.',
        itemImage: '/images/baseball3.jpeg',
        createdAt: DateTime.local(2022, 01, 14).toLocaleString(DateTime.DATETIME_SHORT)
    },
    ]
}

];

// console.log(stories[0]);

exports.getTrades=()=>trades;


exports.getCategory=(id)=>
{
    return trades.find(category=>category.items.find(item=>item.itemId===id));
}

exports.getTrade=(id)=>
{

    let category= trades.find(category=>category.items.find(item=>item.itemId===id));
    if(category)
    {
         return category.items.find(item=>item.itemId===id);
        
    }
    

}

exports.createTrade=(item)=>
{

    
  let cat=trades.find(category=>category.categoryName===item.categoryName);
  item.itemId=uuid();
  item.itemImage='/images/baseball1.jpeg';
  item.createdAt=DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
  if(cat===undefined)
  {
     
    //console.log(cat);
    let new_category={
        categoryId:uuid(),
        categoryName:item.categoryName,
        items:[item]

    }
    console.log(item)
     trades.push(new_category);
    // trades.new_category.items.push(item);
   

  }

  else{
    cat.items.push(item);
   
  }
    

}


exports.deleteById=(id)=>
{
   
    let category= trades.find(category=>category.items.find(item=>item.itemId===id));
    catgeory_id=category.categoryId;
    if(category)
    {
        // return category.items.find(item=>item.itemId===id);
        let index=category.items.findIndex(item=>item.itemId===id);
        if(index!==-1)
        {
            category.items.splice(index,1);
            if(category.items.length===0)
            {
              //  console.log("No items to show");
                let cat_index=trades.findIndex(category=>category.categoryId===catgeory_id);
                trades.splice(cat_index,1);
                
            }
            return true;
        }
        else{
            return false;
        }
    

    }

}

exports.updateById=(id,newItem)=>
{

    let category= trades.find(category=>category.items.find(item=>item.itemId===id));
    if(category)
    {
        category.categoryName=newItem.categoryName;
        let item=category.items.find(category=>category.itemId===id)
        if(item)
        {
            item.itemName=newItem.itemName;
            item.itemDescription=newItem.itemDescription;
            return true;
        }
        else{
            return false;
        }

    }
}