import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import ProductListItem from "../product-list-item";


class ProductList extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    data: []
  }

  render() {
    const {data: products} = this.props;
    return (
      <View>
        {
          products.map(product =>
            <ProductListItem
              key={product.id}
              data={product}
              onClick={this.props.onClickListItem.bind(this, product)}
            />
          )
        }
      </View>
    )
  }
}

export default ProductList
