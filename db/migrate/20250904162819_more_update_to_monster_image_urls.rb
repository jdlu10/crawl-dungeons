class MoreUpdateToMonsterImageUrls < ActiveRecord::Migration[7.1]
  def change
    VisualRender.where(visual_type: 'monster').each do |vr|
      if vr.url.starts_with?('/images/item/icon-')
        vr.update(url: vr.url.gsub('/images/item/icon-', '/images/creatures/icon-'))
      end 
    end
  end
end
