"""
converters.py

このモジュールは、SQLAlchemyのモデルインスタンスを
APIレスポンス用の辞書形式（キャメルケース）に変換するための
ヘルパー関数を提供します。

現在は主に AdminInfo モデルの整形に対応していますが、
将来的には他のモデル（例：District, Schedule など）の整形処理も
ここに追加できます。

使用例:
    from utils.converters import admin_info_to_response
    response = admin_info_to_response(admin_info_instance)
"""

from typing import Any

def admin_info_to_response(admin: Any) -> dict[str, Any]: #FIXME:any
    """
    AdminInfoモデルのインスタンスをAPIレスポンス用の辞書形式に変換する。

    フロントエンドで利用しやすいように、キーをキャメルケースに整形する。

    Args:
        admin (Any): SQLAlchemyのAdminInfoインスタンス

    Returns:
        dict[str, Any]: 整形された辞書形式の管理者情報
    """
    return {
        "municipalityCode": admin.municipality_code,
        "municipalityName": admin.municipality_name,
        "furigana": admin.furigana,
        "postalCode": admin.postal_code,
        "address": admin.address,
        "department": admin.department,
        "contactPerson": admin.contact_person,
        "phoneNumber": admin.phone_number,
        "email": admin.email,
        "paymentStatus": admin.payment_status,
        "lastLogin": admin.last_login.strftime("%Y-%m-%d %H:%M") if admin.last_login else None,
        "paymentDate": admin.payment_date.isoformat() if admin.payment_date else None,
        "note": admin.note,
    }

def municipality_to_response(municipality: Any) -> dict[str, Any]: #FIXME:any
    """
    MunicipalityモデルのインスタンスをAPIレスポンス用の辞書形式に変換する。

    フロントエンドで利用しやすいように、キーをキャメルケースに整形する。
    
    Args:
        municipality (Any): SQLAlchemyのMunicipalityインスタンス

    Returns:
        dict[str, Any]: 整形された辞書形式の市町村情報
    """
    return {
        "municipalityCode": municipality.municipality_code,
        "municipalityName": municipality.municipality_name,
        "furigana": municipality.furigana,
        "postalCode": municipality.postal_code,
        "address": municipality.address,
    }

